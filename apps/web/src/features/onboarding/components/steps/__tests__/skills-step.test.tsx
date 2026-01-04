/**
 * skills-step.test.tsx
 * Tests skill selection and categorization
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkillsStep } from "../skills-step";
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

describe("SkillsStep - Add Skills", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should add skill to list", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SkillsStep />);

    const skillInput = screen.getByPlaceholderText(/skill/i);
    await user.type(skillInput, "JavaScript{enter}");

    const store = useOnboardingStore.getState();
    expect(store.skills.some((s) => s.name === "JavaScript")).toBe(true);
  });

  it("should prevent duplicate skills", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SkillsStep />);

    const skillInput = screen.getByPlaceholderText(/skill/i);
    await user.type(skillInput, "React{enter}");
    await user.type(skillInput, "React{enter}");

    const store = useOnboardingStore.getState();
    expect(store.skills.filter((s) => s.name === "React")).toHaveLength(1);
  });
});

describe("SkillsStep - Remove Skills", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should remove skill from list", async () => {
    const user = userEvent.setup();
    useOnboardingStore.setState({
      skills: [{ id: "1", name: "TypeScript", category: "programming" }],
    });

    renderWithProviders(<SkillsStep />);

    const removeButton = screen.getByRole("button", { name: /remove.*typescript/i });
    await user.click(removeButton);

    const store = useOnboardingStore.getState();
    expect(store.skills.some((s) => s.name === "TypeScript")).toBe(false);
  });
});
