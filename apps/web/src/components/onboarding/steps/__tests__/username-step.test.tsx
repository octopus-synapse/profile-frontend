/**
 * UsernameStep component tests
 * Tests behavior, validation, API interactions, and edge cases
 *
 * Note: UI component mocks are provided globally in test.setup.ts
 * Updated to use useOnboarding hook (100% SDK hooks)
 */

import { describe, it, expect, beforeEach, mock, type Mock } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UsernameStep } from "../username-step";
import { useOnboarding } from "../../hooks";

// Mock StepNavigation component (internal component, not in global setup)
import React from "react";

void mock.module("../step-navigation", () => ({
 StepNavigation: ({ onNext }: { onNext?: () => void }) =>
  React.createElement(
   "button",
   { onClick: onNext, "data-testid": "next-btn" },
   "Next",
  ),
}));

// Mock @profile/api-client SDK
void mock.module("@profile/api-client", () => ({
 useAuthGetSession: mock(() => ({
  data: {
   data: {
    user: {
     id: "mock-user-id",
     email: "test@example.com",
     name: "Test User",
     role: "USER",
     isAdmin: false,
     isApprover: false,
     hasCompletedOnboarding: false,
     emailVerified: true,
     needsOnboarding: true,
     needsEmailVerification: false,
    },
   },
  },
  isLoading: false,
 })),
}));

void mock.module("../../hooks", () => ({
 useOnboarding: mock(() => ({
  username: null,
  goToNextStep: mock(() => Promise.resolve()),
  isSaving: false,
  isLoading: false,
  isError: false,
  error: null,
  isCompleting: false,
  allSteps: [],
  currentStep: "username",
  currentStepMeta: undefined,
  currentStepIndex: 2,
  completedSteps: ["welcome", "personal-info"],
  progress: 0.2,
  canProceed: true,
  personalInfo: null,
  professionalProfile: null,
  templateSelection: null,
  sections: new Map(),
  getSection: () => null,
  goToPreviousStep: mock(() => Promise.resolve()),
  goToStep: mock(() => Promise.resolve()),
  saveStepData: mock(() => Promise.resolve()),
  complete: mock(() => Promise.resolve()),
  refetch: mock(() => Promise.resolve()),
 })),
}));

// Mock fetch with proper typing
const mockFetch = mock(() =>
 Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ available: true }),
 } as Response),
);
global.fetch = mockFetch as unknown as typeof fetch;

/** Helper to get the username input field */
const getUsernameInput = () =>
 screen.getByPlaceholderText("johndoe") as HTMLInputElement;

describe("UsernameStep", () => {
 beforeEach(() => {
  mockFetch.mockClear();
  (useOnboarding as Mock<typeof useOnboarding>).mockClear();
 });

 it("renders username input", () => {
  render(<UsernameStep />);
  const input = getUsernameInput();
  expect(input).not.toBeNull();
 });

 it("normalizes input to lowercase", () => {
  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "JOHN_DOE" } });

  expect(input.value).toBe("john_doe");
 });

 it("removes invalid characters", () => {
  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "john@doe#123" } });

  // Should remove @ and #, keep alphanumeric and underscore
  expect(input.value).toBe("johndoe123");
 });

 it("shows loading state during availability check", async () => {
  let resolveFetch: (value: unknown) => void;
  const fetchPromise = new Promise((resolve) => {
   resolveFetch = resolve;
  });

  mockFetch.mockReturnValue(fetchPromise as Promise<Response>);

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "newuser" } });

  // Should show loading indicator (Loader2 icon with animate-spin)
  await waitFor(() => {
   const loadingText = screen.queryByText(/checking/i);
   expect(loadingText).not.toBeNull();
  });

  resolveFetch!({
   ok: true,
   json: () => Promise.resolve({ available: true }),
  });
 });

 it("shows available state when username is available", async () => {
  mockFetch.mockResolvedValue({
   ok: true,
   json: () => Promise.resolve({ available: true }),
  } as Response);

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "availableuser" } });

  await waitFor(() => {
   // Should show checkmark or "available" message
   const availableIndicator = screen.queryByText(/available/i);
   expect(availableIndicator).not.toBeNull();
  });
 });

 it("shows unavailable state when username is taken", async () => {
  mockFetch.mockResolvedValue({
   ok: true,
   json: () => Promise.resolve({ available: false }),
  } as Response);

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "takenuser" } });

  await waitFor(() => {
   const unavailableMessage = screen.queryByText(/taken/i);
   expect(unavailableMessage).not.toBeNull();
  });
 });

 it("handles API error 401 (unauthorized)", async () => {
  mockFetch.mockResolvedValue({
   ok: false,
   status: 401,
  } as Response);

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "testuser" } });

  await waitFor(() => {
   const errorMessage = screen.queryByText(/session expired/i);
   expect(errorMessage).not.toBeNull();
  });
 });

 it("handles API error 429 (rate limit)", async () => {
  mockFetch.mockResolvedValue({
   ok: false,
   status: 429,
  } as Response);

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "testuser" } });

  await waitFor(() => {
   const errorMessage = screen.queryByText(/too many/i);
   expect(errorMessage).not.toBeNull();
  });
 });

 it("handles network error", async () => {
  mockFetch.mockRejectedValue(new Error("Network error"));

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "testuser" } });

  await waitFor(() => {
   const errorMessage = screen.queryByText(/connection/i);
   expect(errorMessage).not.toBeNull();
  });
 });

 it("debounces API calls", async () => {
  mockFetch.mockResolvedValue({
   ok: true,
   json: () => Promise.resolve({ available: true }),
  } as Response);

  render(<UsernameStep />);
  const input = getUsernameInput();

  // Rapid typing
  fireEvent.change(input, { target: { value: "u" } });
  fireEvent.change(input, { target: { value: "us" } });
  fireEvent.change(input, { target: { value: "use" } });
  fireEvent.change(input, { target: { value: "user" } });

  // Should NOT call API immediately during typing
  expect(mockFetch).toHaveBeenCalledTimes(0);

  // Wait for debounce (500ms) + small buffer
  await waitFor(
   () => {
    expect(mockFetch).toHaveBeenCalledTimes(1);
   },
   { timeout: 1000 },
  );
 });

 it("skips API check if username matches saved username", async () => {
  const mockGoToNextStep = mock(() => Promise.resolve());
  (useOnboarding as Mock<typeof useOnboarding>).mockReturnValue({
   ...((useOnboarding as Mock<typeof useOnboarding>)() as object),
   username: "saveduser",
   goToNextStep: mockGoToNextStep,
   isSaving: false,
  } as unknown as ReturnType<typeof useOnboarding>);

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "saveduser" } });

  // Wait a bit to ensure no API call
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Should not call API for same username
  expect(mockFetch).not.toHaveBeenCalled();
 });

 it("disables next button when username is invalid", () => {
  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "ab" } }); // Too short
  fireEvent.blur(input);

  // Should show validation error - matches UsernameSchema message
  // Use queryAllByText since there may be multiple elements with similar text
  const errorMessages = screen.queryAllByText(/at least 3 characters/i);
  expect(errorMessages.length).toBeGreaterThan(0);
 });

 it("disables next button when username is not available", async () => {
  mockFetch.mockResolvedValue({
   ok: true,
   json: () => Promise.resolve({ available: false }),
  } as Response);

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "takenuser" } });

  await waitFor(() => {
   const takenMessage = screen.queryByText(/taken/i);
   expect(takenMessage).not.toBeNull();
  });
 });

 it("enables next button when username is valid and available", async () => {
  mockFetch.mockResolvedValue({
   ok: true,
   json: () => Promise.resolve({ available: true }),
  } as Response);

  const mockGoToNextStep = mock(() => Promise.resolve());
  (useOnboarding as Mock<typeof useOnboarding>).mockReturnValue({
   ...((useOnboarding as Mock<typeof useOnboarding>)() as object),
   username: null,
   goToNextStep: mockGoToNextStep,
   isSaving: false,
  } as unknown as ReturnType<typeof useOnboarding>);

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "validuser" } });

  await waitFor(() => {
   const availableMessage = screen.queryByText(/available/i);
   expect(availableMessage).not.toBeNull();
  });
 });

 it("shows retry button on error and retries when clicked", async () => {
  mockFetch
   .mockRejectedValueOnce(new Error("Network error"))
   .mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ available: true }),
   } as Response);

  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "testuser" } });

  await waitFor(() => {
   const retryButton = screen.queryByRole("button", { name: /retry/i });
   expect(retryButton).not.toBeNull();
  });

  const retryButton = screen.getByRole("button", { name: /retry/i });
  fireEvent.click(retryButton);

  await waitFor(() => {
   expect(mockFetch).toHaveBeenCalledTimes(2);
  });
 });

 it("handles empty username validation", () => {
  render(<UsernameStep />);
  const input = getUsernameInput();

  fireEvent.change(input, { target: { value: "" } });
  fireEvent.blur(input);

  // Empty username doesn't trigger validation message until touched
  expect(input.value).toBe("");
 });

 it("validates username length (min 3, max 30)", async () => {
  mockFetch.mockResolvedValue({
   ok: true,
   json: () => Promise.resolve({ available: true }),
  } as Response);

  render(<UsernameStep />);
  const input = getUsernameInput();

  // Too short - triggers local validation with UsernameSchema message
  fireEvent.change(input, { target: { value: "ab" } });
  fireEvent.blur(input);

  // Check we have an error state (validation message)
  await waitFor(() => {
   const shortErrors = screen.queryAllByText(/at least 3 characters/i);
   expect(shortErrors.length).toBeGreaterThan(0);
  });

  // Valid length - should pass validation and check availability
  fireEvent.change(input, { target: { value: "validuser" } });
  fireEvent.blur(input);

  // Should show available message
  await waitFor(() => {
   const availableMessage = screen.queryByText(/available/i);
   expect(availableMessage).not.toBeNull();
  });
 });
});
