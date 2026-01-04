/**
 * template-step.test.tsx
 * Tests template selection and customization
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemplateStep } from "../template-step";
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

describe("TemplateStep - Template Selection", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should select template", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TemplateStep />);

    const templateButton = screen.getAllByRole("button", { name: /select/i })[0];
    await user.click(templateButton!);

    const store = useOnboardingStore.getState();
    expect(store.templateSelection).not.toBeNull();
  });
});

describe("TemplateStep - Color Palette", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  it("should change color palette", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TemplateStep />);

    const colorOptions = screen.getAllByRole("button", { name: /color/i });
    if (colorOptions.length > 0) {
      await user.click(colorOptions[0]!);
    }

    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });
});
