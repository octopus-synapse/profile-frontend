/**
 * UsernameStep component tests
 * Tests behavior, validation, API interactions, and edge cases
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UsernameStep } from "../username-step";
import { useOnboardingStore } from "../../../stores";
import { useSession } from "next-auth/react";

// Mock dependencies
mock.module("next-auth/react", () => ({
  useSession: mock(() => ({
    data: { accessToken: "mock-token" },
    status: "authenticated",
  })),
}));

mock.module("../../../stores", () => ({
  useOnboardingStore: mock(() => ({
    username: null,
    setUsername: mock(() => {}),
    goToNextStep: mock(() => {}),
    markStepComplete: mock(() => {}),
  })),
}));

// Mock fetch
global.fetch = mock(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ available: true }),
  })
) as typeof fetch;

describe("UsernameStep", () => {
  beforeEach(() => {
    (global.fetch as ReturnType<typeof mock>).mockClear();
    (useOnboardingStore as ReturnType<typeof mock>).mockClear();
  });

  it("renders username input", () => {
    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);
    expect(input).not.toBeNull();
  });

  it("normalizes input to lowercase", () => {
    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "JOHN_DOE" } });

    expect(input.value).toBe("john_doe");
  });

  it("removes invalid characters", () => {
    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "john@doe#123" } });

    // Should remove @ and #, keep alphanumeric and underscore
    expect(input.value).toBe("johndoe123");
  });

  it("shows loading state during availability check", async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    (global.fetch as ReturnType<typeof mock>).mockReturnValue(fetchPromise);

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    fireEvent.change(input, { target: { value: "newuser" } });

    // Should show loading indicator
    await waitFor(() => {
      const spinner = screen.queryByRole("status");
      expect(spinner).not.toBeNull();
    });

    resolveFetch!({
      ok: true,
      json: () => Promise.resolve({ available: true }),
    });
  });

  it("shows available state when username is available", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: true }),
    } as Response);

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    fireEvent.change(input, { target: { value: "availableuser" } });

    await waitFor(() => {
      // Should show checkmark or "available" message
      const availableIndicator = screen.queryByText(/available/i);
      expect(availableIndicator).not.toBeNull();
    });
  });

  it("shows unavailable state when username is taken", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: false }),
    } as Response);

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    fireEvent.change(input, { target: { value: "takenuser" } });

    await waitFor(() => {
      const unavailableMessage = screen.queryByText(/unavailable|taken/i);
      expect(unavailableMessage).not.toBeNull();
    });
  });

  it("handles API error 401 (unauthorized)", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    fireEvent.change(input, { target: { value: "testuser" } });

    await waitFor(() => {
      const errorMessage = screen.queryByText(/session expired|authenticated/i);
      expect(errorMessage).not.toBeNull();
    });
  });

  it("handles API error 429 (rate limit)", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    fireEvent.change(input, { target: { value: "testuser" } });

    await waitFor(() => {
      const errorMessage = screen.queryByText(/too many|rate limit/i);
      expect(errorMessage).not.toBeNull();
    });
  });

  it("handles network error", async () => {
    (global.fetch as ReturnType<typeof mock>).mockRejectedValue(
      new Error("Network error")
    );

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    fireEvent.change(input, { target: { value: "testuser" } });

    await waitFor(() => {
      const errorMessage = screen.queryByText(/connection|network|offline/i);
      expect(errorMessage).not.toBeNull();
    });
  });

  it("debounces API calls", async () => {
    const fetchMock = global.fetch as ReturnType<typeof mock>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: true }),
    } as Response);

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    // Rapid typing
    fireEvent.change(input, { target: { value: "u" } });
    fireEvent.change(input, { target: { value: "us" } });
    fireEvent.change(input, { target: { value: "use" } });
    fireEvent.change(input, { target: { value: "user" } });

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Should only call API once (after debounce)
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("skips API check if username matches saved username", async () => {
    const mockSetUsername = mock(() => {});
    (useOnboardingStore as ReturnType<typeof mock>).mockReturnValue({
      username: "saveduser",
      setUsername: mockSetUsername,
      goToNextStep: mock(() => {}),
      markStepComplete: mock(() => {}),
    });

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    fireEvent.change(input, { target: { value: "saveduser" } });

    // Wait a bit to ensure no API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Should not call API for same username
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("disables next button when username is invalid", () => {
    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);
    const nextButton = screen.getByRole("button", { name: /next/i });

    fireEvent.change(input, { target: { value: "ab" } }); // Too short

    expect(nextButton).toBeDisabled();
  });

  it("disables next button when username is not available", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: false }),
    } as Response);

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);
    const nextButton = screen.getByRole("button", { name: /next/i });

    fireEvent.change(input, { target: { value: "takenuser" } });

    await waitFor(() => {
      expect(nextButton).toBeDisabled();
    });
  });

  it("enables next button when username is valid and available", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: true }),
    } as Response);

    const mockGoToNextStep = mock(() => {});
    (useOnboardingStore as ReturnType<typeof mock>).mockReturnValue({
      username: null,
      setUsername: mock(() => {}),
      goToNextStep: mockGoToNextStep,
      markStepComplete: mock(() => {}),
    });

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);
    const nextButton = screen.getByRole("button", { name: /next/i });

    fireEvent.change(input, { target: { value: "validuser" } });

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockGoToNextStep).toHaveBeenCalled();
    });
  });

  it("shows retry button on error and retries when clicked", async () => {
    (global.fetch as ReturnType<typeof mock>)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ available: true }),
      } as Response);

    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    fireEvent.change(input, { target: { value: "testuser" } });

    await waitFor(() => {
      const retryButton = screen.queryByRole("button", { name: /retry/i });
      expect(retryButton).not.toBeNull();
    });

    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it("handles empty username validation", () => {
    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);
    const nextButton = screen.getByRole("button", { name: /next/i });

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);

    expect(nextButton).toBeDisabled();
  });

  it("validates username length (min 3, max 30)", () => {
    render(<UsernameStep />);
    const input = screen.getByPlaceholderText(/username/i);

    // Too short
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.blur(input);
    expect(screen.queryByText(/too short|minimum/i)).not.toBeNull();

    // Too long
    fireEvent.change(input, { target: { value: "a".repeat(31) } });
    fireEvent.blur(input);
    expect(screen.queryByText(/too long|maximum/i)).not.toBeNull();

    // Valid length
    fireEvent.change(input, { target: { value: "validuser" } });
    fireEvent.blur(input);
    expect(screen.queryByText(/too short|too long/i)).toBeNull();
  });
});

