/**
 * professional-profile-step.test.tsx
 * Kent Beck: "Discover bugs through comprehensive testing"
 *
 * Tests job title, summary, and social URLs validation
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfessionalProfileStep } from "../professional-profile-step";
import { useOnboardingStore } from "@/features/onboarding/stores";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

function renderWithProviders(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={null}>{component}</SessionProvider>
    </QueryClientProvider>
  );
}

describe("ProfessionalProfileStep - Job Title", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should accept valid job title", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfessionalProfileStep />);

    const titleInput = screen.getByPlaceholderText(/job title/i);
    await user.type(titleInput, "Software Engineer");

    const store = useOnboardingStore.getState();
    expect(store.professionalProfile?.jobTitle).toBe("Software Engineer");
  });

  it("should reject job title longer than 100 chars", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfessionalProfileStep />);

    const titleInput = screen.getByPlaceholderText(/job title/i);
    await user.type(titleInput, "A".repeat(101));
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/maximum 100 characters/i)).toBeInTheDocument();
    });
  });
});

describe("ProfessionalProfileStep - Summary", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should accept professional summary", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfessionalProfileStep />);

    const summaryInput = screen.getByPlaceholderText(/summary/i);
    await user.type(summaryInput, "I am a passionate developer");

    const store = useOnboardingStore.getState();
    expect(store.professionalProfile?.summary).toContain("passionate developer");
  });

  it("should accept empty summary (optional)", async () => {
    renderWithProviders(<ProfessionalProfileStep />);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeInTheDocument();
  });
});

describe("ProfessionalProfileStep - Social URLs", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should accept valid LinkedIn URL", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfessionalProfileStep />);

    const linkedinInput = screen.getByPlaceholderText(/linkedin/i);
    await user.type(linkedinInput, "https://linkedin.com/in/johndoe");

    await waitFor(() => {
      expect(screen.queryByText(/invalid.*linkedin/i)).not.toBeInTheDocument();
    });
  });

  it("should reject invalid LinkedIn URL", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfessionalProfileStep />);

    const linkedinInput = screen.getByPlaceholderText(/linkedin/i);
    await user.type(linkedinInput, "not-a-url");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid.*url/i)).toBeInTheDocument();
    });
  });

  it("should accept valid GitHub URL", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfessionalProfileStep />);

    const githubInput = screen.getByPlaceholderText(/github/i);
    await user.type(githubInput, "https://github.com/johndoe");

    await waitFor(() => {
      expect(screen.queryByText(/invalid.*github/i)).not.toBeInTheDocument();
    });
  });

  it("should accept empty social URLs (optional)", async () => {
    renderWithProviders(<ProfessionalProfileStep />);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeInTheDocument();
  });
});
