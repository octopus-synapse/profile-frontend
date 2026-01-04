/**
 * personal-info-step.test.tsx
 *
 * Kent Beck: "Tests specify how the software should behave"
 * Robert C. Martin: "Tests are the documentation of the system"
 *
 * This suite characterizes PersonalInfoStep component behavior:
 * - Email validation (format, lowercase, trim)
 * - Full name validation (length, unicode support)
 * - Phone validation (international formats, optional)
 * - Location inputs (country, city, state - all optional)
 * - Form state management (canProceed, data persistence)
 * - Accessibility (labels, error messages, keyboard navigation)
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PersonalInfoStep } from "../personal-info-step";
import { useOnboardingStore } from "@/features/onboarding/stores";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

/**
 * Test wrapper providing required providers
 */
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

describe("PersonalInfoStep - Email Validation", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    localStorage.clear();
  });

  it("should accept valid email format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "valid@example.com");

    // Should not show error for valid email
    await waitFor(() => {
      expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    });
  });

  it("should reject invalid email format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");
    await user.tab(); // Trigger blur validation

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("should trim whitespace from email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "  test@example.com  ");

    const store = useOnboardingStore.getState();
    expect(store.personalInfo?.email).toBe("test@example.com");
  });

  it("should convert email to lowercase", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "TEST@EXAMPLE.COM");

    const store = useOnboardingStore.getState();
    expect(store.personalInfo?.email).toBe("test@example.com");
  });

  it("should reject email without @ symbol", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalidemail.com");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("should reject email with multiple @ symbols", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@@example.com");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("should accept email with subdomain", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "user@mail.example.com");

    await waitFor(() => {
      expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    });
  });

  it("should accept email with + symbol (plus addressing)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "user+tag@example.com");

    await waitFor(() => {
      expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    });
  });
});

describe("PersonalInfoStep - Full Name Validation", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    localStorage.clear();
  });

  it("should accept name with unicode characters (é, ñ, ü)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, "José García");

    const store = useOnboardingStore.getState();
    expect(store.personalInfo!.fullName).toBe("José García");
  });

  it("should reject name shorter than 2 characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, "A");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it("should reject name longer than 100 characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const nameInput = screen.getByLabelText(/full name/i);
    const longName = "A".repeat(101);
    await user.type(nameInput, longName);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/cannot exceed 100 characters/i)).toBeInTheDocument();
    });
  });

  it("should accept name with hyphens (Jean-Claude)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, "Jean-Claude Van Damme");

    const store = useOnboardingStore.getState();
    expect(store.personalInfo!.fullName).toBe("Jean-Claude Van Damme");
  });

  it("should trim whitespace from name", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, "  John Doe  ");
    await user.tab(); // Trigger blur

    const store = useOnboardingStore.getState();
    expect(store.personalInfo?.fullName).toBe("John Doe");
  });
});

describe("PersonalInfoStep - Phone Validation", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    localStorage.clear();
  });

  it("should accept international phone with + prefix", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, "+1234567890");

    const store = useOnboardingStore.getState();
    // Phone input formats the number, so check it contains the digits in formatted form
    expect(store.personalInfo?.phone).toMatch(/\+1.*2.*3.*4.*5.*6.*7.*8.*9.*0/);
  });

  it("should accept phone with spaces and dashes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, "+1 (555) 123-4567");

    await waitFor(() => {
      expect(screen.queryByText(/invalid phone/i)).not.toBeInTheDocument();
    });
  });

  it("should accept phone without country code (local format)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, "555-1234");

    await waitFor(() => {
      expect(screen.queryByText(/invalid phone/i)).not.toBeInTheDocument();
    });
  });

  it("should reject phone with letters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, "555-CALL-ME");

    // Letters should be filtered out, leaving only numbers and dashes
    const store = useOnboardingStore.getState();
    expect(store.personalInfo?.phone).toMatch(/^[0-9\s\-\(\)\+]*$/);
    expect(store.personalInfo?.phone).not.toMatch(/[a-zA-Z]/);
  });

  it("should accept empty phone (optional field)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.click(phoneInput);
    await user.tab(); // Focus and blur without typing

    // No error should be shown for empty optional field
    await waitFor(() => {
      expect(screen.queryByText(/invalid phone/i)).not.toBeInTheDocument();
    });
  });
});

describe("PersonalInfoStep - Location Inputs", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    localStorage.clear();
  });

  it("should accept country input", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const locationInput = screen.getByLabelText(/location/i);
    await user.type(locationInput, "United States");

    const store = useOnboardingStore.getState();
    expect(store.personalInfo!.location).toBe("United States");
  });

  it("should accept city input", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const locationInput = screen.getByLabelText(/location/i);
    await user.type(locationInput, "San Francisco");

    const store = useOnboardingStore.getState();
    expect(store.personalInfo!.location).toBe("San Francisco");
  });

  it("should accept state input", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const locationInput = screen.getByLabelText(/location/i);
    await user.type(locationInput, "California");

    const store = useOnboardingStore.getState();
    expect(store.personalInfo!.location).toBe("California");
  });

  it("should allow all location fields to be empty (optional)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    // Leave all location fields empty
    const continueButton = screen.getByRole("button", { name: /continue/i });

    // If email and name are valid, should be able to continue
    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/full name/i);

    await user.type(emailInput, "test@example.com");
    await user.type(nameInput, "John Doe");

    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });
  });
});

describe("PersonalInfoStep - Form State Management", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    localStorage.clear();
  });

  it("should disable continue button when email is invalid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/full name/i);
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "invalid-email");

    await waitFor(() => {
      expect(continueButton).toBeDisabled();
    });
  });

  it("should disable continue button when name is invalid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/full name/i);
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await user.type(emailInput, "test@example.com");
    await user.type(nameInput, "A"); // Too short

    await waitFor(() => {
      expect(continueButton).toBeDisabled();
    });
  });

  it("should enable continue button when email and name are valid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/full name/i);
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await user.type(emailInput, "test@example.com");
    await user.type(nameInput, "John Doe");

    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });
  });

  it("should persist data to store on input change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const store = useOnboardingStore.getState();
    expect(store.personalInfo!.email).toBe("test@example.com");
  });

  it("should restore data from store on mount", () => {
    // Pre-populate store
    useOnboardingStore.setState({
      personalInfo: {
        email: "existing@example.com",
        fullName: "Existing User",
        phone: "+1234567890",
        location: "New York, NY, USA",
      },
    });

    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/phone/i) as HTMLInputElement;

    expect(emailInput.value).toBe("existing@example.com");
    expect(nameInput.value).toBe("Existing User");
    // Phone input formats the number
    expect(phoneInput.value).toMatch(/\+1.*2.*3.*4.*5.*6.*7.*8.*9.*0/);
  });
});

describe("PersonalInfoStep - Accessibility", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    localStorage.clear();
  });

  it("should have accessible labels for all inputs", () => {
    renderWithProviders(<PersonalInfoStep />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it("should associate error messages with inputs (aria-describedby)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid");
    await user.tab();

    await waitFor(() => {
      const errorMessage = screen.getByText(/invalid email/i);
      expect(errorMessage).toBeInTheDocument();

      const errorId = errorMessage.getAttribute("id");
      expect(emailInput.getAttribute("aria-describedby")).toContain(errorId!);
    });
  });

  it("should mark invalid inputs with aria-invalid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid");
    await user.tab();

    await waitFor(() => {
      expect(emailInput).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("should allow keyboard navigation between inputs", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);

    // Focus name input
    nameInput.focus();
    expect(nameInput).toHaveFocus();

    // Press Enter key to move to next input
    await user.keyboard("{Enter}");
    expect(emailInput).toHaveFocus();
  });

  it("should show required field indicators", () => {
    renderWithProviders(<PersonalInfoStep />);

    // Email and name are required - check for asterisk in the DOM
    const labels = screen.getAllByText("*");

    // Should have at least 2 asterisks (for email and fullName)
    expect(labels.length).toBeGreaterThanOrEqual(2);
  });
});
