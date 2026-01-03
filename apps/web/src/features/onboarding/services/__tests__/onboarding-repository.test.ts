/**
 * Onboarding Repository Tests
 * Uncle Bob: "Test behavior, not implementation"
 * Kent Beck: "Test-first thinking forces good design"
 *
 * Tests for the onboarding repository that handles API calls.
 * Uses MSW to mock HTTP requests for deterministic testing.
 */

import { onboardingRepository } from "../onboarding-repository";
import {
  server,
  setupMswServer,
  createMockOnboardingProgress,
  createMockSubmitOnboardingDto,
  failedProgressSaveHandler,
  validationErrorHandler,
} from "@/shared/testing";
import { http, HttpResponse } from "msw";

const API_BASE = "http://localhost:3001/api";

// Setup MSW server for this test suite
setupMswServer();

describe("onboardingRepository", () => {
  /**
   * Uncle Bob: "One assert per test"
   * Each test focuses on a single behavior
   */

  describe("getStatus()", () => {
    it("should fetch onboarding status successfully", async () => {
      // Arrange
      const expectedStatus = {
        hasCompletedOnboarding: false,
        onboardingCompletedAt: undefined,
      };

      server.use(
        http.get(`${API_BASE}/onboarding/status`, () => {
          return HttpResponse.json(expectedStatus);
        })
      );

      // Act
      const result = await onboardingRepository.getStatus();

      // Assert
      expect(result).toEqual(expectedStatus);
    });

    it("should return completed status when onboarding is done", async () => {
      // Arrange
      const expectedStatus = {
        hasCompletedOnboarding: true,
        onboardingCompletedAt: "2024-01-01T00:00:00.000Z",
      };

      server.use(
        http.get(`${API_BASE}/onboarding/status`, () => {
          return HttpResponse.json(expectedStatus);
        })
      );

      // Act
      const result = await onboardingRepository.getStatus();

      // Assert
      expect(result.hasCompletedOnboarding).toBe(true);
      expect(result.onboardingCompletedAt).toBeDefined();
    });
  });

  describe("getProgress()", () => {
    it("should fetch onboarding progress successfully", async () => {
      // Arrange
      const mockProgress = createMockOnboardingProgress();

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () => {
          return HttpResponse.json(mockProgress);
        })
      );

      // Act
      const result = await onboardingRepository.getProgress();

      // Assert
      expect(result).toEqual(mockProgress);
    });

    it("should return progress with current step", async () => {
      // Arrange
      const mockProgress = createMockOnboardingProgress({
        currentStep: "professional-profile",
        completedSteps: ["welcome", "personal-info", "username"],
      });

      server.use(
        http.get(`${API_BASE}/onboarding/progress`, () => {
          return HttpResponse.json(mockProgress);
        })
      );

      // Act
      const result = await onboardingRepository.getProgress();

      // Assert
      expect(result.currentStep).toBe("professional-profile");
      expect(result.completedSteps).toHaveLength(3);
    });
  });

  describe("saveProgress()", () => {
    it("should save progress successfully", async () => {
      // Arrange
      const progressData = createMockOnboardingProgress({
        currentStep: "personal-info",
        completedSteps: ["welcome"],
      });

      const expectedResponse = {
        success: true,
        currentStep: "personal-info",
        completedSteps: ["welcome"],
      };

      server.use(
        http.put(`${API_BASE}/onboarding/progress`, () => {
          return HttpResponse.json(expectedResponse);
        })
      );

      // Act
      const result = await onboardingRepository.saveProgress(progressData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.currentStep).toBe("personal-info");
    });

    it("should handle network error when saving progress", async () => {
      // Arrange
      const progressData = createMockOnboardingProgress();

      // Override with failing handler
      server.use(failedProgressSaveHandler);

      // Act & Assert
      await expect(
        onboardingRepository.saveProgress(progressData)
      ).rejects.toMatchObject({
        code: "INTERNAL_SERVER_ERROR",
      });
    });

    it("should send complete progress data to backend", async () => {
      // Arrange
      const progressData = createMockOnboardingProgress({
        currentStep: "review",
        username: "joaosilva",
        personalInfo: {
          fullName: "João Silva",
          email: "joao@example.com",
        },
      });

      let receivedData: any = null;

      server.use(
        http.put(`${API_BASE}/onboarding/progress`, async ({ request }) => {
          receivedData = await request.json();
          return HttpResponse.json({
            success: true,
            currentStep: "review",
            completedSteps: [],
          });
        })
      );

      // Act
      await onboardingRepository.saveProgress(progressData);

      // Assert
      expect(receivedData).toMatchObject({
        currentStep: "review",
        username: "joaosilva",
        personalInfo: expect.objectContaining({
          fullName: "João Silva",
        }),
      });
    });
  });

  describe("submit()", () => {
    it("should submit onboarding successfully", async () => {
      // Arrange
      const submitData = createMockSubmitOnboardingDto();

      const expectedResponse = {
        success: true,
        resumeId: "resume-123",
        message: "Onboarding completed successfully!",
      };

      server.use(
        http.post(`${API_BASE}/onboarding`, () => {
          return HttpResponse.json(expectedResponse);
        })
      );

      // Act
      const result = await onboardingRepository.submit(submitData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.resumeId).toBe("resume-123");
      expect(result.message).toBeDefined();
    });

    it("should handle validation error on submission", async () => {
      // Arrange
      const submitData = createMockSubmitOnboardingDto();

      // Override with validation error handler
      server.use(validationErrorHandler);

      // Act & Assert
      await expect(
        onboardingRepository.submit(submitData)
      ).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
    });

    it("should send complete submit data to backend", async () => {
      // Arrange
      const submitData = createMockSubmitOnboardingDto({
        username: "testuser",
        personalInfo: {
          fullName: "Test User",
          email: "test@example.com",
          phone: "+55 11 99999-9999",
          location: "São Paulo, SP",
        },
      });

      let receivedData: any = null;

      server.use(
        http.post(`${API_BASE}/onboarding`, async ({ request }) => {
          receivedData = await request.json();
          return HttpResponse.json({
            success: true,
            resumeId: "resume-456",
            message: "Success",
          });
        })
      );

      // Act
      await onboardingRepository.submit(submitData);

      // Assert
      expect(receivedData).toMatchObject({
        username: "testuser",
        personalInfo: expect.objectContaining({
          fullName: "Test User",
          email: "test@example.com",
        }),
      });
    });

    it("should include all required fields in submission", async () => {
      // Arrange
      const submitData = createMockSubmitOnboardingDto();

      let receivedData: any = null;

      server.use(
        http.post(`${API_BASE}/onboarding`, async ({ request }) => {
          receivedData = await request.json();
          return HttpResponse.json({
            success: true,
            resumeId: "resume-789",
            message: "Success",
          });
        })
      );

      // Act
      await onboardingRepository.submit(submitData);

      // Assert - verify all required fields are present
      expect(receivedData).toHaveProperty("username");
      expect(receivedData).toHaveProperty("personalInfo");
      expect(receivedData).toHaveProperty("professionalProfile");
      expect(receivedData).toHaveProperty("skillsStep");
      expect(receivedData).toHaveProperty("templateSelection");
    });
  });
});
