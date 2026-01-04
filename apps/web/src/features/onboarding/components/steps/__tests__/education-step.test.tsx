/**
 * education-step.test.tsx
 * Tests CRUD operations for education entries
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EducationStep } from "../education-step";
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

describe("EducationStep - Add Education", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should add new education entry", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EducationStep />);

    const addButton = screen.getByRole("button", { name: /add.*education/i });
    await user.click(addButton);

    const institutionInput = screen.getByPlaceholderText(/institution/i);
    await user.type(institutionInput, "MIT");

    const store = useOnboardingStore.getState();
    expect(store.education).toHaveLength(1);
    expect(store.education[0]!.institution).toBe("MIT");
  });

  it("should validate required fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EducationStep />);

    const addButton = screen.getByRole("button", { name: /add.*education/i });
    await user.click(addButton);

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/institution.*required/i)).toBeInTheDocument();
    });
  });
});

describe("EducationStep - Edit Education", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should edit existing education", async () => {
    const user = userEvent.setup();
    useOnboardingStore.setState({
      education: [
        {
          id: "1",
          institution: "MIT",
          degree: "BSc",
          field: "CS",
          startDate: "2016",
          endDate: "2020",
          isCurrent: false,
        },
      ],
    });

    renderWithProviders(<EducationStep />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    const institutionInput = screen.getByPlaceholderText(/institution/i);
    await user.clear(institutionInput);
    await user.type(institutionInput, "Stanford");

    const store = useOnboardingStore.getState();
    expect(store.education[0]!.institution).toBe("Stanford");
  });
});

describe("EducationStep - No Education Option", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should allow skipping education section", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EducationStep />);

    const noEduCheckbox = screen.getByLabelText(/no.*education/i);
    await user.click(noEduCheckbox);

    const store = useOnboardingStore.getState();
    expect(store.noEducation).toBe(true);
  });
});
