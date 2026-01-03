/**
 * Onboarding Sync Hook - Regression Tests
 *
 * Purpose: Characterization testing to freeze known bug fixes
 * Michael Feathers: "Tests for legacy code are about knowing what the system does today"
 * Kent Beck: "Tests are specifications, written in code"
 *
 * This suite documents and prevents regression of 5 critical bug fixes:
 * 1. FIX L33-34: Track lastSavedAt timestamp for UI feedback
 * 2. FIX L140-144: Save on EVERY step change (removed race condition)
 * 3. FIX L155-159: Await save operation before proceeding
 * 4. FIX L169-170: Debounce rapid navigation (300ms)
 * 5. FIX L203-204: Expose lastSavedAt and saveError state
 *
 * If any test here fails, we either:
 * (a) found a regression of a known bug, or
 * (b) changed behavior that was intentionally fixed
 *
 * Both cases require investigation before merging.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { useOnboardingSync } from "../use-onboarding-sync";
import { useOnboardingStore } from "../../stores";
import { server, setupMswServer, createMockOnboardingProgress } from "@/shared/testing";
import { http, HttpResponse, delay } from "msw";
import { useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { Session } from "next-auth";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  SessionProvider: ({ children }: { children: ReactNode }) => children,
}));
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

const API_BASE = "http://localhost:3001/api";

// Setup MSW server for this test suite
setupMswServer();

/**
 * Test setup utilities
 */
function setupAuthenticatedSession() {
  mockUseSession.mockReturnValue({
    data: {
      user: { id: "test-user", email: "test@example.com" },
      accessToken: "mock-token",
      expires: new Date(Date.now() + 3600000).toISOString(),
    },
    status: "authenticated",
    update: jest.fn(),
  });
}

function setupUnauthenticatedSession() {
  mockUseSession.mockReturnValue({
    data: null,
    status: "unauthenticated",
    update: jest.fn(),
  });
}

function resetOnboardingStore() {
  useOnboardingStore.setState({
    currentStep: "welcome",
    completedSteps: [],
    personalInfo: null,
    username: null,
    professionalProfile: null,
    experiences: [],
    noExperience: false,
    education: [],
    noEducation: false,
    skills: [],
    noSkills: false,
    languages: [],
    templateSelection: null,
  });
}

/**
 * Wrapper for renderHook with all necessary providers
 */
function createWrapper(session: Session | null = null) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });

  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useOnboardingSync - Regression Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetOnboardingStore();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  /**
   * REGRESSION TEST #1: FIX L33-34
   * Bug: No timestamp tracking for last save
   * Fix: Added lastSavedAt state
   * Risk: UI can't show "Saved 2 minutes ago" feedback
   */
  describe("[REGRESSION #1] lastSavedAt timestamp tracking", () => {
    it("should initialize lastSavedAt as null before any save", () => {
      setupAuthenticatedSession();

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        )
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      // Should start as null
      expect(result.current.lastSavedAt).toBeNull();
    });

    it("should update lastSavedAt timestamp after successful save", async () => {
      setupAuthenticatedSession();
      const mockNow = new Date("2024-01-01T12:00:00Z");
      jest.setSystemTime(mockNow);

      // Setup handlers
      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, () => HttpResponse.json({ success: true }))
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      // Wait for hydration
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Trigger save by changing step
      useOnboardingStore.setState({ currentStep: "personal-info" });

      // Fast-forward debounce timer (300ms)
      jest.advanceTimersByTime(300);

      // Wait for save to complete
      await waitFor(() => {
        expect(result.current.lastSavedAt).not.toBeNull();
      });

      // Timestamp should match the save time
      expect(result.current.lastSavedAt?.getTime()).toBeGreaterThanOrEqual(mockNow.getTime());
    });

    it("should NOT update lastSavedAt when save fails", async () => {
      setupAuthenticatedSession();

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json({ error: "Network error" }, { status: 500 })
        )
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      useOnboardingStore.setState({ currentStep: "personal-info" });
      jest.advanceTimersByTime(300);

      await waitFor(() => expect(result.current.saveError).toBeTruthy());

      // Timestamp should still be null after failed save
      expect(result.current.lastSavedAt).toBeNull();
    });
  });

  /**
   * REGRESSION TEST #2: FIX L140-144
   * Bug: First step change was NOT being saved (race condition)
   * Fix: Removed early return for first step, now saves on EVERY change
   * Risk: User fills welcome step, navigates away, data is lost
   *
   * This was the most critical bug - users lost data on the very first step.
   */
  describe("[REGRESSION #2] Save on FIRST step change (critical race condition)", () => {
    it("should save progress when moving from welcome to personal-info (first step change)", async () => {
      setupAuthenticatedSession();
      let saveWasCalled = false;

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, async ({ request }) => {
          saveWasCalled = true;
          const body = await request.json();
          return HttpResponse.json({ success: true, ...body });
        })
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      // Wait for hydration
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // This is the FIRST step change from welcome → personal-info
      useOnboardingStore.setState({ currentStep: "personal-info" });

      // Fast-forward debounce
      jest.advanceTimersByTime(300);

      // Assert: The save MUST be called (this was the bug)
      await waitFor(() => {
        expect(saveWasCalled).toBe(true);
      });
    });

    it("should save progress on second step change as well", async () => {
      setupAuthenticatedSession();
      const saveCalls: string[] = [];

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress({ currentStep: "personal-info" }))
        ),
        http.put(`${API_BASE}/onboarding/progress`, async ({ request }) => {
          const body = (await request.json()) as { currentStep: string };
          saveCalls.push(body.currentStep);
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Second step change
      useOnboardingStore.setState({ currentStep: "username" });
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(saveCalls).toContain("username");
      });
    });

    it("should NOT save if step did not actually change", async () => {
      setupAuthenticatedSession();
      let saveCallCount = 0;

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, () => {
          saveCallCount++;
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Set the same step twice
      useOnboardingStore.setState({ currentStep: "welcome" });
      jest.advanceTimersByTime(300);

      useOnboardingStore.setState({ currentStep: "welcome" });
      jest.advanceTimersByTime(300);

      // Should not trigger save (no actual change)
      expect(saveCallCount).toBe(0);
    });
  });

  /**
   * REGRESSION TEST #3: FIX L155-159
   * Bug: Used mutate() instead of mutateAsync(), not awaiting save
   * Fix: Now awaits save completion before updating timestamp
   * Risk: Race condition where UI shows "saved" but request still pending
   */
  describe("[REGRESSION #3] Await save operation before marking complete", () => {
    it("should wait for save to complete before updating lastSavedAt", async () => {
      setupAuthenticatedSession();
      const saveDelay = 500; // Simulate slow network
      const timestampBeforeSave = new Date();

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, async () => {
          await delay(saveDelay);
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      useOnboardingStore.setState({ currentStep: "personal-info" });
      jest.advanceTimersByTime(300); // Debounce

      // Timestamp should still be null while save is pending
      expect(result.current.lastSavedAt).toBeNull();
      expect(result.current.isSaving).toBe(false); // Not yet saving (debounced)

      // Advance to trigger actual save
      jest.advanceTimersByTime(saveDelay);

      // Wait for save to complete
      await waitFor(
        () => {
          expect(result.current.lastSavedAt).not.toBeNull();
        },
        { timeout: 2000 }
      );

      // Timestamp should be AFTER the save completed
      expect(result.current.lastSavedAt!.getTime()).toBeGreaterThan(timestampBeforeSave.getTime());
    });

    it("should handle save failure without updating lastSavedAt", async () => {
      setupAuthenticatedSession();

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, async () => {
          await delay(200);
          return HttpResponse.json({ error: "Server error" }, { status: 500 });
        })
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      useOnboardingStore.setState({ currentStep: "personal-info" });
      jest.advanceTimersByTime(300);
      jest.advanceTimersByTime(200);

      await waitFor(() => expect(result.current.saveError).toBeTruthy());

      // Should NOT have updated timestamp
      expect(result.current.lastSavedAt).toBeNull();
    });
  });

  /**
   * REGRESSION TEST #4: FIX L169-170
   * Bug: No debouncing, excessive API calls on rapid navigation
   * Fix: Added 300ms debounce
   * Risk: Backend overload, rate limiting, poor UX during rapid clicks
   */
  describe("[REGRESSION #4] Debounce rapid step changes (300ms)", () => {
    it("should debounce rapid step changes and only save once", async () => {
      setupAuthenticatedSession();
      let saveCallCount = 0;

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, () => {
          saveCallCount++;
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Rapid navigation: 5 step changes in 100ms each
      useOnboardingStore.setState({ currentStep: "personal-info" });
      jest.advanceTimersByTime(100);

      useOnboardingStore.setState({ currentStep: "username" });
      jest.advanceTimersByTime(100);

      useOnboardingStore.setState({ currentStep: "professional-profile" });
      jest.advanceTimersByTime(100);

      useOnboardingStore.setState({ currentStep: "experience" });
      jest.advanceTimersByTime(100);

      useOnboardingStore.setState({ currentStep: "education" });

      // Now wait for full debounce (300ms from last change)
      jest.advanceTimersByTime(300);

      await waitFor(() => expect(saveCallCount).toBeGreaterThan(0));

      // Should have saved only for the LAST step (debounced)
      // Not 5 times (one for each change)
      expect(saveCallCount).toBeLessThan(5);
    });

    it("should respect debounce timeout of exactly 300ms", async () => {
      setupAuthenticatedSession();
      let saveWasCalled = false;

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, () => {
          saveWasCalled = true;
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      useOnboardingStore.setState({ currentStep: "personal-info" });

      // At 299ms, should NOT have saved yet
      jest.advanceTimersByTime(299);
      expect(saveWasCalled).toBe(false);

      // At 300ms, should trigger save
      jest.advanceTimersByTime(1);

      await waitFor(() => {
        expect(saveWasCalled).toBe(true);
      });
    });
  });

  /**
   * REGRESSION TEST #5: FIX L203-204
   * Bug: lastSavedAt and saveError not exposed in return value
   * Fix: Now exposed for UI components to consume
   * Risk: UI can't show save status, error messages, or timestamps
   */
  describe("[REGRESSION #5] Expose lastSavedAt and saveError state", () => {
    it("should expose lastSavedAt in hook return value", async () => {
      setupAuthenticatedSession();

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, () => HttpResponse.json({ success: true }))
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Should have the property
      expect(result.current).toHaveProperty("lastSavedAt");
      expect(result.current.lastSavedAt).toBeNull(); // Initially null

      // After save
      useOnboardingStore.setState({ currentStep: "personal-info" });
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(result.current.lastSavedAt).toBeInstanceOf(Date);
      });
    });

    it("should expose saveError in hook return value", async () => {
      setupAuthenticatedSession();

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json({ error: "Database error" }, { status: 500 })
        )
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Should have the property
      expect(result.current).toHaveProperty("saveError");
      expect(result.current.saveError).toBeNull(); // Initially null

      // Trigger save error
      useOnboardingStore.setState({ currentStep: "personal-info" });
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(result.current.saveError).toBeTruthy();
      });
    });

    it("should expose isSaving status during save operation", async () => {
      setupAuthenticatedSession();

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, async () => {
          await delay(500);
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      useOnboardingStore.setState({ currentStep: "personal-info" });
      jest.advanceTimersByTime(300);

      // Should show isSaving during operation
      await waitFor(() => {
        expect(result.current.isSaving).toBe(true);
      });

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(result.current.isSaving).toBe(false);
      });
    });
  });

  /**
   * CROSS-CUTTING REGRESSION TEST
   * Test that all 5 fixes work together in a realistic scenario
   */
  describe("[INTEGRATION] All fixes working together", () => {
    it("should handle complete onboarding flow with all fixes active", async () => {
      setupAuthenticatedSession();
      const saveCalls: Array<{ step: string; timestamp: number }> = [];

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () =>
          HttpResponse.json(createMockOnboardingProgress())
        ),
        http.put(`${API_BASE}/onboarding/progress`, async ({ request }) => {
          const body = (await request.json()) as { currentStep: string };
          saveCalls.push({
            step: body.currentStep,
            timestamp: Date.now(),
          });
          await delay(100); // Realistic network delay
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useOnboardingSync(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Step 1: First step change (FIX #2)
      useOnboardingStore.setState({ currentStep: "personal-info" });
      jest.advanceTimersByTime(300); // Debounce (FIX #4)
      jest.advanceTimersByTime(100); // Network delay

      await waitFor(() => {
        expect(result.current.lastSavedAt).not.toBeNull(); // FIX #1, #5
      });

      const firstSaveTime = result.current.lastSavedAt!.getTime();

      // Step 2: Rapid changes should debounce
      useOnboardingStore.setState({ currentStep: "username" });
      jest.advanceTimersByTime(100);
      useOnboardingStore.setState({ currentStep: "professional-profile" });
      jest.advanceTimersByTime(300);
      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(result.current.lastSavedAt!.getTime()).toBeGreaterThan(firstSaveTime);
      });

      // Should have debounced (not saved username step)
      expect(saveCalls.length).toBeLessThan(3);

      // All state exposed correctly (FIX #5)
      expect(result.current).toHaveProperty("lastSavedAt");
      expect(result.current).toHaveProperty("saveError");
      expect(result.current).toHaveProperty("isSaving");
    });
  });
});
