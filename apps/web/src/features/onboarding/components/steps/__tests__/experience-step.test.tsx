/**
 * experience-step.test.tsx
 * Tests CRUD operations for work experience entries
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExperienceStep } from "../experience-step";
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

describe("ExperienceStep - Add Experience", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should add new experience entry", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExperienceStep />);

    const addButton = screen.getByRole("button", { name: /add.*experience/i });
    await user.click(addButton);

    const companyInput = screen.getByPlaceholderText(/company/i);
    await user.type(companyInput, "Google");

    const store = useOnboardingStore.getState();
    expect(store.experiences).toHaveLength(1);
    expect(store.experiences[0]!.company).toBe("Google");
  });

  it("should validate required fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExperienceStep />);

    const addButton = screen.getByRole("button", { name: /add.*experience/i });
    await user.click(addButton);

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/company.*required/i)).toBeInTheDocument();
    });
  });

  it("should validate date range (end after start)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExperienceStep />);

    const addButton = screen.getByRole("button", { name: /add.*experience/i });
    await user.click(addButton);

    const startInput = screen.getByLabelText(/start date/i);
    const endInput = screen.getByLabelText(/end date/i);

    await user.type(startInput, "2023-12-01");
    await user.type(endInput, "2022-01-01");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/end.*after.*start/i)).toBeInTheDocument();
    });
  });
});

describe("ExperienceStep - Edit Experience", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should edit existing experience", async () => {
    const user = userEvent.setup();
    useOnboardingStore.setState({
      experiences: [
        { id: "1", company: "Google", position: "Engineer", startDate: "2020-01", isCurrent: true },
      ],
    });

    renderWithProviders(<ExperienceStep />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    const companyInput = screen.getByPlaceholderText(/company/i);
    await user.clear(companyInput);
    await user.type(companyInput, "Meta");

    const store = useOnboardingStore.getState();
    expect(store.experiences[0]!.company).toBe("Meta");
  });
});

describe("ExperienceStep - Delete Experience", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should remove experience entry", async () => {
    const user = userEvent.setup();
    useOnboardingStore.setState({
      experiences: [
        { id: "1", company: "Google", position: "Engineer", startDate: "2020-01", isCurrent: true },
      ],
    });

    renderWithProviders(<ExperienceStep />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    const store = useOnboardingStore.getState();
    expect(store.experiences).toHaveLength(0);
  });
});

describe("ExperienceStep - No Experience Option", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should allow skipping experience section", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExperienceStep />);

    const noExpCheckbox = screen.getByLabelText(/no.*experience/i);
    await user.click(noExpCheckbox);

    const store = useOnboardingStore.getState();
    expect(store.noExperience).toBe(true);
  });
});
