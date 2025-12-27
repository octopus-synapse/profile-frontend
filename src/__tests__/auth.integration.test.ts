/**
 * Auth Integration Tests
 * Tests the authentication flow against the real backend
 */

import axios from "axios";

const API_URL = "http://localhost:3001/api";

const TEST_CREDENTIALS = {
  email: "user@gmail.com",
  password: "userpasswd123",
};

// Helper to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Auth Integration Tests", () => {
  // Single comprehensive login test to avoid rate limiting
  describe("POST /auth/login", () => {
    it("should login and return all required fields for NextAuth", async () => {
      const response = await axios.post(`${API_URL}/auth/login`, TEST_CREDENTIALS);

      // Basic response checks
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.token).toBeDefined();
      expect(typeof response.data.token).toBe("string");

      const { user } = response.data;

      // Required fields for NextAuth
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("role");
      expect(user).toHaveProperty("hasCompletedOnboarding");

      // Type checks
      expect(typeof user.id).toBe("string");
      expect(typeof user.email).toBe("string");
      expect(["USER", "ADMIN"]).toContain(user.role);
      expect(typeof user.hasCompletedOnboarding).toBe("boolean");

      // Optional fields should exist (can be null)
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("image");

      // Log the response for visual verification
      console.log("\n✅ LOGIN RESPONSE:");
      console.log(JSON.stringify(response.data, null, 2));

      // Simulate the transform done in auth-service.ts
      const transformed = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.image ?? null,
          role: user.role,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        },
        accessToken: response.data.token,
      };

      console.log("\n✅ TRANSFORMED FOR NEXTAUTH:");
      console.log(JSON.stringify(transformed, null, 2));

      // This is what NextAuth authorize() will use
      expect(transformed.user.role).toBe("ADMIN");
      expect(transformed.accessToken).toBeDefined();
    });
  });
});

describe("Onboarding Progress Endpoints", () => {
  let authToken: string;

  beforeAll(async () => {
    await delay(1000); // Wait to avoid rate limiting
    const response = await axios.post(`${API_URL}/auth/login`, TEST_CREDENTIALS);
    authToken = response.data.token;
  });

  describe("GET /onboarding/progress", () => {
    it("should return onboarding progress for authenticated user", async () => {
      const response = await axios.get(`${API_URL}/onboarding/progress`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("currentStep");
      expect(response.data).toHaveProperty("completedSteps");

      console.log("\n✅ ONBOARDING PROGRESS:");
      console.log(JSON.stringify(response.data, null, 2));
    });
  });

  describe("PUT /onboarding/progress", () => {
    it("should save onboarding progress", async () => {
      await delay(500); // Wait to avoid rate limiting

      const progressData = {
        currentStep: "personal-info",
        completedSteps: ["welcome"],
        personalInfo: {
          fullName: "Test User",
          email: "test@example.com",
        },
        professionalProfile: null,
        experiences: [],
        noExperience: false,
        education: [],
        noEducation: false,
        skills: [],
        noSkills: false,
        languages: [],
        templateSelection: null,
      };

      const response = await axios.put(`${API_URL}/onboarding/progress`, progressData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);

      console.log("\n✅ SAVE PROGRESS RESPONSE:");
      console.log(JSON.stringify(response.data, null, 2));
    });
  });
});
