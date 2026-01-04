/**
 * review-step.test.tsx
 * Tests final review and data verification before submission
 */

import { render, screen } from "@testing-library/react";
import { ReviewStep } from "../review-step";
import { useOnboardingStore } from "@/features/onboarding/stores";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

function renderWithProviders(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={null}>{component}</SessionProvider>
    </QueryClientProvider>
  );
}

describe("ReviewStep - Display Data", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should display personal info", () => {
    useOnboardingStore.setState({
      personalInfo: {
        email: "test@example.com",
        fullName: "John Doe",
      },
    });

    renderWithProviders(<ReviewStep />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should display professional profile", () => {
    useOnboardingStore.setState({
      professionalProfile: {
        jobTitle: "Software Engineer",
        summary: "Experienced developer",
      },
    });

    renderWithProviders(<ReviewStep />);

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Experienced developer")).toBeInTheDocument();
  });
});

describe("ReviewStep - Edit Navigation", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should have edit buttons for each section", () => {
    renderWithProviders(<ReviewStep />);

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons.length).toBeGreaterThan(0);
  });
});

describe("ReviewStep - Submit", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should have submit button", () => {
    renderWithProviders(<ReviewStep />);

    const submitButton = screen.getByRole("button", { name: /submit|finish/i });
    expect(submitButton).toBeInTheDocument();
  });
});
