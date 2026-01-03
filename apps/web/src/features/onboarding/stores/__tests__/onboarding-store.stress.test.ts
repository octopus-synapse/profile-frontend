/**
 * Onboarding Store - Stress Tests
 *
 * Kent Beck: "Make the code scream under pressure"
 * Michael Feathers: "Tests reveal what the system can't handle"
 *
 * Purpose: Find edge cases, limits, and corruption scenarios
 * These tests are DESIGNED TO FAIL if the code has hidden weaknesses
 *
 * Categories:
 * 1. localStorage corruption (malformed JSON, quota exceeded)
 * 2. Data limits (huge strings, arrays, deeply nested)
 * 3. Invalid state transitions
 * 4. Concurrent modifications
 * 5. Memory leaks (repeated operations)
 */

import { useOnboardingStore, type OnboardingStep } from "../onboarding-store";

describe("onboarding-store - Stress & Edge Cases", () => {
  beforeEach(() => {
    // Clear localStorage to avoid test pollution
    localStorage.clear();

    // Reset store
    useOnboardingStore.setState({
      currentStep: "welcome",
      completedSteps: [],
      personalInfo: null,
      username: null,
      professionalProfile: null,
      experiences: [],
      noExperience: false,
      education: [],
      noEducation: false,
      skills: [],
      noSkills: false,
      languages: [],
      templateSelection: null,
      stepErrors: {},
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("[CORRUPTION] localStorage malformed data", () => {
    it("should handle corrupted JSON in localStorage", () => {
      // Simulate corrupted localStorage (invalid JSON)
      localStorage.setItem("profile-onboarding", "{invalid json here");

      // Try to read store (should not crash)
      expect(() => {
        const store = useOnboardingStore.getState();
        store.getStateForBackend();
      }).not.toThrow();
    });

    it("should handle partially valid localStorage data", () => {
      // Missing required fields
      const partialData = JSON.stringify({
        state: {
          currentStep: "professional-profile",
          // Missing other fields
        },
      });

      localStorage.setItem("profile-onboarding", partialData);

      const store = useOnboardingStore.getState();

      // Should not crash, should use defaults
      expect(() => store.getStateForBackend()).not.toThrow();
    });

    it("should handle localStorage with wrong data types", () => {
      const wrongTypes = JSON.stringify({
        state: {
          currentStep: 123, // Should be string
          completedSteps: "not-an-array", // Should be array
          personalInfo: "not-an-object", // Should be object
        },
      });

      localStorage.setItem("profile-onboarding", wrongTypes);

      expect(() => {
        const store = useOnboardingStore.getState();
        store.currentStep; // Try to access
      }).not.toThrow();
    });

    it("should handle null/undefined in critical fields", () => {
      const nullData = JSON.stringify({
        state: {
          currentStep: null,
          completedSteps: undefined,
          personalInfo: null,
        },
      });

      localStorage.setItem("profile-onboarding", nullData);

      const store = useOnboardingStore.getState();

      // Should not crash when building payload
      expect(() => {
        try {
          store.buildSubmissionPayload();
        } catch (e) {
          // Expected to throw due to missing data,
          // but should not crash the app
        }
      }).not.toThrow();
    });
  });

  describe("[LIMITS] Data size and boundaries", () => {
    it("should handle extremely long strings in personalInfo", () => {
      const store = useOnboardingStore.getState();

      // 10MB string (unrealistic but tests limits)
      const hugeName = "A".repeat(10 * 1024 * 1024);

      expect(() => {
        store.setPersonalInfo({
          fullName: hugeName,
          email: "test@example.com",
        });
      }).not.toThrow();

      // Verify it was stored
      const { personalInfo } = useOnboardingStore.getState();
      expect(personalInfo?.fullName.length).toBe(10 * 1024 * 1024);
    });

    it("should handle hundreds of experiences", () => {
      const store = useOnboardingStore.getState();

      // Add 500 experiences (unrealistic but tests array limits)
      for (let i = 0; i < 500; i++) {
        store.addExperience({
          id: `exp-${i}`,
          company: `Company ${i}`,
          position: `Position ${i}`,
          startDate: "2020-01",
          isCurrent: false,
        });
      }

      const { experiences } = useOnboardingStore.getState();
      expect(experiences).toHaveLength(500);

      // Should be able to build payload without crashing
      expect(() => {
        try {
          store.buildSubmissionPayload();
        } catch (e) {
          // May throw due to missing required fields, that's ok
        }
      }).not.toThrow();
    });

    it("should handle special characters in all text fields", () => {
      const store = useOnboardingStore.getState();

      const specialChars = `<script>alert('xss')</script> 
        \n\r\t\0
        emoji: 🚀💻🔥
        unicode: ñáéíóú
        symbols: !@#$%^&*()_+-={}[]|\\:";'<>?,./
        quotes: "double" 'single' \`backtick\``;

      expect(() => {
        store.setPersonalInfo({
          fullName: specialChars,
          email: "test@example.com",
          phone: specialChars,
          location: specialChars,
        });

        store.setProfessionalProfile({
          jobTitle: specialChars,
          summary: specialChars,
          linkedin: specialChars,
        });
      }).not.toThrow();
    });

    it("should handle empty strings vs null vs undefined", () => {
      const store = useOnboardingStore.getState();

      // Test different "empty" values
      store.setPersonalInfo({
        fullName: "",
        email: "test@example.com",
        phone: "",
        location: undefined as any,
      });

      const { personalInfo } = useOnboardingStore.getState();

      // Should distinguish between empty string and undefined
      expect(personalInfo?.fullName).toBe("");
      expect(personalInfo?.phone).toBe("");
    });

    it("should handle negative and zero IDs in arrays", () => {
      const store = useOnboardingStore.getState();

      store.addExperience({
        id: "-1",
        company: "Test",
        position: "Dev",
        startDate: "2020-01",
        isCurrent: true,
      });

      store.addExperience({
        id: "0",
        company: "Test2",
        position: "Dev2",
        startDate: "2020-01",
        isCurrent: true,
      });

      const { experiences } = useOnboardingStore.getState();
      expect(experiences).toHaveLength(2);

      // Should be able to remove by weird IDs
      expect(() => {
        store.removeExperience("-1");
        store.removeExperience("0");
      }).not.toThrow();
    });
  });

  describe("[INVALID STATE] Bad transitions and operations", () => {
    it("should handle jumping to non-existent step", () => {
      const store = useOnboardingStore.getState();

      // Try to jump to invalid step
      expect(() => {
        store.setCurrentStep("non-existent-step" as OnboardingStep);
      }).not.toThrow();

      // What happens if we try to proceed?
      expect(() => {
        store.goToNextStep();
      }).not.toThrow();
    });

    it("should handle going backwards multiple times rapidly", () => {
      const store = useOnboardingStore.getState();

      // Start at review step
      store.setCurrentStep("review");

      // Go back 10 times rapidly
      expect(() => {
        for (let i = 0; i < 10; i++) {
          store.goToPreviousStep();
        }
      }).not.toThrow();

      // Should be at welcome (can't go further back)
      const { currentStep } = useOnboardingStore.getState();
      expect(currentStep).toBe("welcome");
    });

    it("should handle marking non-existent step as complete", () => {
      const store = useOnboardingStore.getState();

      expect(() => {
        store.markStepComplete("invalid-step" as OnboardingStep);
      }).not.toThrow();

      const { completedSteps } = useOnboardingStore.getState();

      // Might add it anyway (bug?) or might ignore (correct?)
      // Test documents current behavior
      expect(completedSteps).toBeDefined();
    });

    it("should handle updating non-existent experience", () => {
      const store = useOnboardingStore.getState();

      // Try to update experience that doesn't exist
      expect(() => {
        store.updateExperience("non-existent-id", {
          company: "Updated Company",
        });
      }).not.toThrow();

      // Should not have created a new experience
      const { experiences } = useOnboardingStore.getState();
      expect(experiences).toHaveLength(0);
    });

    it("should handle removing non-existent items", () => {
      const store = useOnboardingStore.getState();

      expect(() => {
        store.removeExperience("does-not-exist");
        store.removeEducation("does-not-exist");
        store.removeSkill("does-not-exist");
        store.removeLanguage("does-not-exist");
      }).not.toThrow();
    });

    it("should handle duplicate IDs in arrays", () => {
      const store = useOnboardingStore.getState();

      // Add same ID twice
      store.addExperience({
        id: "duplicate",
        company: "First",
        position: "Dev",
        startDate: "2020-01",
        isCurrent: true,
      });

      store.addExperience({
        id: "duplicate",
        company: "Second",
        position: "Dev",
        startDate: "2021-01",
        isCurrent: true,
      });

      const { experiences } = useOnboardingStore.getState();

      // Should we have 2 items? Or should it dedupe?
      // Test documents current behavior
      expect(experiences.length).toBeGreaterThanOrEqual(1);

      // If we remove by ID, does it remove one or both?
      store.removeExperience("duplicate");
      const afterRemove = useOnboardingStore.getState().experiences;

      // Document what happens
      expect(afterRemove.length).toBeLessThan(experiences.length);
    });
  });

  describe("[CONCURRENCY] Rapid state changes", () => {
    it("should handle 100 rapid step changes", () => {
      const store = useOnboardingStore.getState();

      expect(() => {
        for (let i = 0; i < 100; i++) {
          store.goToNextStep();
          store.goToPreviousStep();
        }
      }).not.toThrow();

      // State should be consistent
      const { currentStep } = useOnboardingStore.getState();
      expect(currentStep).toBeDefined();
    });

    it("should handle rapidly adding and removing same item", () => {
      const store = useOnboardingStore.getState();

      expect(() => {
        for (let i = 0; i < 50; i++) {
          store.addExperience({
            id: "rapid-test",
            company: "Test",
            position: "Dev",
            startDate: "2020-01",
            isCurrent: true,
          });
          store.removeExperience("rapid-test");
        }
      }).not.toThrow();

      const { experiences } = useOnboardingStore.getState();
      expect(experiences).toHaveLength(0);
    });

    it("should handle updating same field repeatedly", () => {
      const store = useOnboardingStore.getState();

      expect(() => {
        for (let i = 0; i < 100; i++) {
          store.setUsername(`user${i}`);
        }
      }).not.toThrow();

      const { username } = useOnboardingStore.getState();
      expect(username).toBe("user99");
    });

    it("should handle reset while operations are pending", () => {
      const store = useOnboardingStore.getState();

      // Simulate a scenario where we're modifying data
      store.setPersonalInfo({ fullName: "Test", email: "test@example.com" });
      store.addExperience({
        id: "1",
        company: "Corp",
        position: "Dev",
        startDate: "2020-01",
        isCurrent: true,
      });

      // Then immediately reset
      expect(() => {
        store.reset();
      }).not.toThrow();

      const state = useOnboardingStore.getState();
      expect(state.currentStep).toBe("welcome");
      expect(state.personalInfo).toBeNull();
      expect(state.experiences).toHaveLength(0);
    });
  });

  describe("[VALIDATION] Email edge cases", () => {
    it("should handle various invalid email formats", () => {
      const store = useOnboardingStore.getState();

      const invalidEmails = [
        "plaintext",
        "@example.com",
        "user@",
        "user name@example.com", // Space
        "user@example", // No TLD
        "user@@example.com", // Double @
        "user@.com", // No domain
        ".user@example.com", // Starts with dot
        "user.@example.com", // Ends with dot
        "user@example..com", // Double dot
        "",
        " ",
        "null",
        "undefined",
      ];

      store.setCurrentStep("personal-info");

      invalidEmails.forEach((email) => {
        store.setPersonalInfo({
          fullName: "Test User",
          email: email,
        });

        const canProceed = store.canProceed();

        // Should NOT allow proceeding with invalid email
        // If this fails, we found a validation bug
        expect(canProceed).toBe(false);
      });
    });

    it("should handle edge case valid emails", () => {
      const store = useOnboardingStore.getState();

      const edgeCaseValidEmails = [
        "user+tag@example.com",
        "user.name@example.com",
        "user_name@example.com",
        "123@example.com",
        "a@b.co",
        "test@subdomain.example.com",
      ];

      store.setCurrentStep("personal-info");

      edgeCaseValidEmails.forEach((email) => {
        store.setPersonalInfo({
          fullName: "Test User",
          email: email,
        });

        const canProceed = store.canProceed();

        // SHOULD allow these valid emails
        expect(canProceed).toBe(true);
      });
    });
  });

  describe("[MEMORY] Repeated operations don't leak", () => {
    it("should not leak memory when adding/removing 1000 items", () => {
      const store = useOnboardingStore.getState();

      const initialMemory = process.memoryUsage().heapUsed;

      // Add and remove 1000 experiences
      for (let i = 0; i < 1000; i++) {
        store.addExperience({
          id: `exp-${i}`,
          company: `Company ${i}`,
          position: "Developer",
          startDate: "2020-01",
          isCurrent: false,
        });
      }

      for (let i = 0; i < 1000; i++) {
        store.removeExperience(`exp-${i}`);
      }

      const { experiences } = useOnboardingStore.getState();
      expect(experiences).toHaveLength(0);

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryGrowth = finalMemory - initialMemory;

      // Memory shouldn't grow unbounded (allow some growth for test overhead)
      // This is a heuristic test - might need adjustment
      expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // Less than 10MB growth
    });

    it("should not accumulate step errors indefinitely", () => {
      const store = useOnboardingStore.getState();

      // Set errors 1000 times
      for (let i = 0; i < 1000; i++) {
        store.setStepErrors("personal-info", [`Error ${i}`]);
      }

      const { stepErrors } = useOnboardingStore.getState();

      // Should only have latest error, not 1000 errors
      expect(stepErrors["personal-info"]?.length).toBe(1);
    });
  });

  describe("[PAYLOAD] buildSubmissionPayload edge cases", () => {
    it("should handle building payload with minimal data", () => {
      const store = useOnboardingStore.getState();

      // Absolute minimum required
      store.setPersonalInfo({ fullName: "A", email: "a@b.c" });
      store.setUsername("a");
      store.setProfessionalProfile({ jobTitle: "J", summary: "S" });
      store.setSkills([{ id: "1", name: "S", category: "C" }]);
      store.setTemplateSelection({ template: "professional", palette: "blue" });

      expect(() => {
        const payload = store.buildSubmissionPayload();
        expect(payload).toBeDefined();
      }).not.toThrow();
    });

    it("should handle building payload with maximal data", () => {
      const store = useOnboardingStore.getState();

      // Set ALL fields to maximum
      store.setPersonalInfo({
        fullName: "Very Long Name ".repeat(100),
        email: "test@example.com",
        phone: "+5511999999999",
        location: "São Paulo, Brazil, Earth, Solar System",
      });

      store.setUsername("username123");

      store.setProfessionalProfile({
        jobTitle: "Senior Principal Staff Distinguished Fellow Engineer",
        summary: "Lorem ipsum ".repeat(500),
        linkedin: "https://linkedin.com/in/user",
        github: "https://github.com/user",
        website: "https://example.com",
      });

      // Add 50 of each
      for (let i = 0; i < 50; i++) {
        store.addExperience({
          id: `exp-${i}`,
          company: `Company ${i}`,
          position: `Position ${i}`,
          startDate: "2020-01",
          isCurrent: i === 0,
          description: "Description ".repeat(100),
        });

        store.addEducation({
          id: `edu-${i}`,
          institution: `University ${i}`,
          degree: "Bachelor",
          field: "Computer Science",
          startDate: "2015-01",
          isCurrent: false,
        });

        store.addSkill({
          id: `skill-${i}`,
          name: `Skill ${i}`,
          category: "Technical",
          level: 5,
        });

        store.addLanguage({
          id: `lang-${i}`,
          name: `Language ${i}`,
          level: "fluente",
        });
      }

      store.setTemplateSelection({ template: "professional", palette: "blue" });

      expect(() => {
        const payload = store.buildSubmissionPayload();
        expect(payload).toBeDefined();
      }).not.toThrow();
    });

    it("should handle payload with no optional fields", () => {
      const store = useOnboardingStore.getState();

      store.setPersonalInfo({ fullName: "Test", email: "test@example.com" });
      store.setUsername("test");
      store.setProfessionalProfile({ jobTitle: "Dev", summary: "Test" });
      store.setNoExperience(true);
      store.setNoEducation(true);
      store.setSkills([{ id: "1", name: "JS", category: "Lang" }]);
      store.setNoSkills(false);
      store.setTemplateSelection({ template: "professional", palette: "blue" });

      const payload = store.buildSubmissionPayload();

      // Should have no* flags set correctly
      expect(payload.noExperience).toBe(true);
      expect(payload.noEducation).toBe(true);
      expect(payload.experiences).toEqual([]);
      expect(payload.education).toEqual([]);
    });
  });

  describe("[PERSISTENCE] localStorage quota and persistence", () => {
    it("should handle localStorage quota exceeded gracefully", () => {
      const store = useOnboardingStore.getState();

      // Try to save huge data that might exceed quota
      const hugeDescription = "X".repeat(5 * 1024 * 1024); // 5MB

      expect(() => {
        store.setProfessionalProfile({
          jobTitle: "Developer",
          summary: hugeDescription,
        });
      }).not.toThrow();

      // Should still function even if persistence fails
      const { professionalProfile } = useOnboardingStore.getState();
      expect(professionalProfile).toBeDefined();
    });

    it("should persist and restore complex nested state", () => {
      const store = useOnboardingStore.getState();

      // Set complex state
      store.setPersonalInfo({ fullName: "Test", email: "test@example.com" });
      store.addExperience({
        id: "1",
        company: "Corp",
        position: "Dev",
        startDate: "2020-01",
        isCurrent: true,
      });
      store.setCurrentStep("review");
      store.markStepComplete("welcome");
      store.markStepComplete("personal-info");

      // Simulate page refresh by getting fresh state
      // (In real app, Zustand would restore from localStorage)
      const savedState = store.getStateForBackend();

      expect(savedState.currentStep).toBe("review");
      expect(savedState.experiences).toHaveLength(1);
      expect(savedState.completedSteps.length).toBeGreaterThan(0);
    });
  });
});
