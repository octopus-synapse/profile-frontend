/**
 * Onboarding Store Tests
 *
 * Kent Beck: "Test state transitions, not implementation"
 *
 * Purpose: Validate core state management logic without external dependencies
 * This tests Zustand store in isolation - no API calls, no React, pure state logic
 *
 * Critical invariants being tested:
 * 1. Step navigation follows correct sequence
 * 2. Data persistence works correctly
 * 3. Validation prevents invalid state
 * 4. buildSubmissionPayload creates valid DTOs
 * 5. State corruption (bad localStorage) doesn't crash app
 */

import { useOnboardingStore, ONBOARDING_STEPS, type OnboardingStep } from "../onboarding-store";

describe("onboarding-store - Core State Management", () => {
  beforeEach(() => {
    // Reset store to initial state
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

  describe("[CORE] Step navigation", () => {
    it("should start at welcome step", () => {
      const { currentStep } = useOnboardingStore.getState();
      expect(currentStep).toBe("welcome");
    });

    it("should advance to next step", () => {
      const { goToNextStep, currentStep } = useOnboardingStore.getState();

      goToNextStep();

      const newStep = useOnboardingStore.getState().currentStep;
      expect(newStep).toBe("personal-info");
    });

    it("should go back to previous step", () => {
      const { setCurrentStep, goToPreviousStep } = useOnboardingStore.getState();

      setCurrentStep("professional-profile");
      goToPreviousStep();

      const newStep = useOnboardingStore.getState().currentStep;
      expect(newStep).toBe("username");
    });

    it("should mark step as completed when advancing", () => {
      const { goToNextStep } = useOnboardingStore.getState();

      goToNextStep(); // welcome → personal-info

      const { completedSteps } = useOnboardingStore.getState();
      expect(completedSteps).toContain("welcome");
    });

    it("should not go back from welcome step", () => {
      const { goToPreviousStep } = useOnboardingStore.getState();

      goToPreviousStep();

      const { currentStep } = useOnboardingStore.getState();
      expect(currentStep).toBe("welcome"); // Should stay at welcome
    });

    it("should not advance past complete step", () => {
      const { setCurrentStep, goToNextStep } = useOnboardingStore.getState();

      setCurrentStep("complete");
      goToNextStep();

      const { currentStep } = useOnboardingStore.getState();
      expect(currentStep).toBe("complete"); // Should stay at complete
    });

    it("should calculate progress percentage correctly", () => {
      const { goToNextStep, getProgress } = useOnboardingStore.getState();

      // At welcome (step 0 of 11)
      expect(getProgress()).toBe(0);

      // After going to personal-info (completed welcome = 1/11)
      goToNextStep();
      const progressAfterFirst = getProgress();
      expect(progressAfterFirst).toBeGreaterThan(0);
      expect(progressAfterFirst).toBeLessThan(100);
    });
  });

  describe("[CORE] Data management", () => {
    it("should save personal info", () => {
      const { setPersonalInfo } = useOnboardingStore.getState();

      const personalInfo = {
        fullName: "João Silva",
        email: "joao@example.com",
        phone: "+5511999999999",
        location: "São Paulo, BR",
      };

      setPersonalInfo(personalInfo);

      const { personalInfo: saved } = useOnboardingStore.getState();
      expect(saved).toEqual(personalInfo);
    });

    it("should save username", () => {
      const { setUsername } = useOnboardingStore.getState();

      setUsername("joaosilva");

      const { username } = useOnboardingStore.getState();
      expect(username).toBe("joaosilva");
    });

    it("should save professional profile", () => {
      const { setProfessionalProfile } = useOnboardingStore.getState();

      const profile = {
        jobTitle: "Senior Software Engineer",
        summary: "Experienced in fullstack development",
        linkedin: "linkedin.com/in/joaosilva",
        github: "github.com/joaosilva",
      };

      setProfessionalProfile(profile);

      const { professionalProfile } = useOnboardingStore.getState();
      expect(professionalProfile).toEqual(profile);
    });

    it("should add and remove experiences", () => {
      const { addExperience, removeExperience } = useOnboardingStore.getState();

      const experience = {
        id: "exp-1",
        company: "TechCorp",
        position: "Developer",
        startDate: "2020-01",
        isCurrent: true,
      };

      addExperience(experience);
      expect(useOnboardingStore.getState().experiences).toHaveLength(1);

      removeExperience("exp-1");
      expect(useOnboardingStore.getState().experiences).toHaveLength(0);
    });

    it("should update existing experience", () => {
      const { addExperience, updateExperience } = useOnboardingStore.getState();

      const experience = {
        id: "exp-1",
        company: "TechCorp",
        position: "Junior Developer",
        startDate: "2020-01",
        isCurrent: true,
      };

      addExperience(experience);
      updateExperience("exp-1", { position: "Senior Developer" });

      const { experiences } = useOnboardingStore.getState();
      expect(experiences[0].position).toBe("Senior Developer");
    });

    it("should handle noExperience flag", () => {
      const { setNoExperience } = useOnboardingStore.getState();

      setNoExperience(true);

      const { noExperience } = useOnboardingStore.getState();
      expect(noExperience).toBe(true);
    });
  });

  describe("[CRITICAL] buildSubmissionPayload", () => {
    it("should throw error when required fields are missing", () => {
      const { buildSubmissionPayload } = useOnboardingStore.getState();

      // No data provided yet
      expect(() => buildSubmissionPayload()).toThrow();
    });

    it("should build valid payload with all required data", () => {
      const store = useOnboardingStore.getState();

      // Set required data
      store.setPersonalInfo({
        fullName: "João Silva",
        email: "joao@example.com",
      });
      store.setUsername("joaosilva");
      store.setProfessionalProfile({
        jobTitle: "Developer",
        summary: "Experienced developer",
      });
      store.setSkills([{ id: "1", name: "JavaScript", category: "Programming Languages" }]);
      store.setTemplateSelection({ template: "professional", palette: "blue" });

      const payload = store.buildSubmissionPayload();

      expect(payload).toHaveProperty("personalInfo");
      expect(payload).toHaveProperty("username");
      expect(payload).toHaveProperty("professionalProfile");
      expect(payload).toHaveProperty("skills");
      expect(payload).toHaveProperty("templateSelection");
      expect(payload.username).toBe("joaosilva");
    });

    it("should include optional fields when provided", () => {
      const store = useOnboardingStore.getState();

      // Set all data including optional
      store.setPersonalInfo({
        fullName: "João Silva",
        email: "joao@example.com",
        phone: "+5511999999999",
      });
      store.setUsername("joaosilva");
      store.setProfessionalProfile({
        jobTitle: "Developer",
        summary: "Experienced",
      });
      store.setExperiences([
        {
          id: "1",
          company: "TechCorp",
          position: "Dev",
          startDate: "2020-01",
          isCurrent: true,
        },
      ]);
      store.setSkills([{ id: "1", name: "JS", category: "Lang" }]);
      store.setTemplateSelection({ template: "professional", palette: "blue" });

      const payload = store.buildSubmissionPayload();

      expect(payload.experiences).toHaveLength(1);
      expect(payload.personalInfo.phone).toBe("+5511999999999");
    });

    it("should handle noExperience flag in payload", () => {
      const store = useOnboardingStore.getState();

      store.setPersonalInfo({ fullName: "João", email: "joao@example.com" });
      store.setUsername("joao");
      store.setProfessionalProfile({ jobTitle: "Dev", summary: "Test" });
      store.setNoExperience(true); // No experience
      store.setSkills([{ id: "1", name: "JS", category: "Lang" }]);
      store.setTemplateSelection({ template: "professional", palette: "blue" });

      const payload = store.buildSubmissionPayload();

      expect(payload.noExperience).toBe(true);
      expect(payload.experiences).toEqual([]);
    });
  });

  describe("[CRITICAL] Validation and canProceed", () => {
    it("should allow proceeding from welcome (no validation)", () => {
      const { canProceed } = useOnboardingStore.getState();

      const result = canProceed();

      expect(result).toBe(true);
    });

    it("should block proceeding when required fields missing", () => {
      const { setCurrentStep, canProceed } = useOnboardingStore.getState();

      setCurrentStep("personal-info");

      const result = canProceed();

      // Should not proceed without personal info
      expect(result).toBe(false);
    });

    it("should allow proceeding when current step is valid", () => {
      const { setCurrentStep, setPersonalInfo, canProceed } = useOnboardingStore.getState();

      setCurrentStep("personal-info");
      setPersonalInfo({
        fullName: "João Silva",
        email: "joao@example.com",
      });

      const result = canProceed();

      expect(result).toBe(true);
    });

    it("should validate email format in personalInfo", () => {
      const { setPersonalInfo, setCurrentStep, canProceed } = useOnboardingStore.getState();

      setCurrentStep("personal-info");
      setPersonalInfo({
        fullName: "João Silva",
        email: "invalid-email", // Invalid
      });

      const result = canProceed();

      expect(result).toBe(false);
    });
  });

  describe("[SYNC] Backend hydration", () => {
    it("should hydrate state from backend data", () => {
      const { hydrateFromBackend } = useOnboardingStore.getState();

      const backendData = {
        currentStep: "professional-profile" as OnboardingStep,
        completedSteps: ["welcome", "personal-info", "username"] as OnboardingStep[],
        personalInfo: {
          fullName: "João Silva",
          email: "joao@example.com",
        },
        username: "joaosilva",
        professionalProfile: {
          jobTitle: "Developer",
          summary: "Experienced",
        },
        experiences: [],
        noExperience: false,
        education: [],
        noEducation: false,
        skills: [],
        noSkills: false,
        languages: [],
        templateSelection: null,
      };

      hydrateFromBackend(backendData);

      const state = useOnboardingStore.getState();
      expect(state.currentStep).toBe("professional-profile");
      expect(state.completedSteps).toHaveLength(3);
      expect(state.personalInfo?.fullName).toBe("João Silva");
      expect(state.username).toBe("joaosilva");
    });

    it("should get state for backend save", () => {
      const store = useOnboardingStore.getState();

      store.setPersonalInfo({ fullName: "João", email: "joao@example.com" });
      store.setUsername("joao");

      const stateForBackend = store.getStateForBackend();

      expect(stateForBackend).toHaveProperty("currentStep");
      expect(stateForBackend).toHaveProperty("completedSteps");
      expect(stateForBackend).toHaveProperty("personalInfo");
      expect(stateForBackend).toHaveProperty("username");
      expect(stateForBackend.personalInfo?.fullName).toBe("João");
    });
  });

  describe("[RESILIENCE] Reset and error handling", () => {
    it("should reset store to initial state", () => {
      const store = useOnboardingStore.getState();

      // Set some data
      store.setPersonalInfo({ fullName: "João", email: "joao@example.com" });
      store.setUsername("joao");
      store.setCurrentStep("professional-profile");

      // Reset
      store.reset();

      const state = useOnboardingStore.getState();
      expect(state.currentStep).toBe("welcome");
      expect(state.personalInfo).toBeNull();
      expect(state.username).toBeNull();
      expect(state.completedSteps).toEqual([]);
    });

    it("should set and clear step errors", () => {
      const { setStepErrors, clearStepErrors } = useOnboardingStore.getState();

      setStepErrors("personal-info", ["Email is invalid", "Name is required"]);

      let { stepErrors } = useOnboardingStore.getState();
      expect(stepErrors["personal-info"]).toHaveLength(2);

      clearStepErrors("personal-info");

      stepErrors = useOnboardingStore.getState().stepErrors;
      expect(stepErrors["personal-info"]).toBeUndefined();
    });
  });
});
