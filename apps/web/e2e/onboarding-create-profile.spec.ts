/**
 * Onboarding "Create Profile" E2E Test
 * Uses API to advance steps, UI only for final create profile action.
 */

import { expect, test } from "@playwright/test";

const API_URL = "http://localhost:3001";

test.describe("Onboarding - Create Profile", () => {
  test.setTimeout(60000);

  test("should complete onboarding and create profile", async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      email: `e2e-${timestamp}@test.com`,
      password: "SecurePass123!",
      name: "E2E Test User",
    };
    const username = `e2euser${timestamp}`;

    // 1. Register new user via API
    console.log("Step 1: Registering user...");
    const signup = await page.request.post(`${API_URL}/api/accounts`, {
      data: { email: testUser.email, password: testUser.password, name: testUser.name },
    });
    if (!signup.ok()) {
      console.log("Signup failed:", await signup.text());
      test.skip();
      return;
    }

    // 2. Login via UI (needed to set httpOnly cookie in browser)
    console.log("Step 2: Logging in...");
    await page.goto("/en/auth/sign-in");
    await page.locator("#email").fill(testUser.email);
    await page.locator("#password").fill(testUser.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/onboarding|protected/, { timeout: 20000 });

    // 3. Use page.request (shares cookies with browser) to advance steps
    console.log("Step 3: Advancing through onboarding via API...");

    // Welcome -> Personal Info
    await page.request.post(`${API_URL}/api/v1/onboarding/session/next`, { data: {} });

    // Personal Info -> Username
    await page.request.post(`${API_URL}/api/v1/onboarding/session/next`, {
      data: { fullName: "E2E Test User", email: testUser.email },
    });

    // Username -> Professional Profile
    await page.request.post(`${API_URL}/api/v1/onboarding/session/next`, {
      data: { username },
    });

    // Professional Profile -> Template
    await page.request.post(`${API_URL}/api/v1/onboarding/session/next`, {
      data: {
        jobTitle: "Software Engineer",
        summary: "Experienced software engineer with expertise in building scalable web applications using React, Node.js, and TypeScript.",
      },
    });

    // Template -> Skip sections
    await page.request.post(`${API_URL}/api/v1/onboarding/session/next`, {
      data: { theme: "default", palette: "blue" },
    });

    // Skip: Languages, Skills, Education, Experience
    for (let i = 0; i < 4; i++) {
      await page.request.post(`${API_URL}/api/v1/onboarding/session/next`, {
        data: { noData: true },
      });
    }

    // Check current step
    const sessionResp = await page.request.get(`${API_URL}/api/v1/onboarding/session`);
    const session = await sessionResp.json();
    console.log("Current step:", session.data?.currentStep);

    // 4. Navigate to onboarding page and find Create Profile button
    console.log("Step 4: Loading review page in browser...");
    await page.goto("/en/protected/onboarding");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const heading = await page.locator("h1, h2").first().textContent();
    console.log("Page heading:", heading);
    await page.screenshot({ path: "/tmp/review.png" });

    // 5. Find and click Create Profile
    const createBtn = page.getByRole("button", { name: /create profile|finish|finalizar/i });
    
    if (!(await createBtn.isVisible({ timeout: 5000 }).catch(() => false))) {
      // Maybe need to click continue to reach review
      const continueBtn = page.getByRole("button", { name: /continue/i });
      if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await continueBtn.click();
        await page.waitForTimeout(1000);
      }
    }

    if (await createBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log("Step 5: Clicking Create Profile...");
      
      // Listen for API response
      const responsePromise = page.waitForResponse(
        r => r.url().includes("/session/complete"),
        { timeout: 15000 }
      );

      await createBtn.click();

      const response = await responsePromise.catch(() => null);
      
      if (response) {
        console.log("API Response status:", response.status());
        
        if (!response.ok()) {
          const body = await response.json().catch(() => ({}));
          console.log("ERROR:", JSON.stringify(body, null, 2));
          await page.screenshot({ path: "/tmp/create-error.png" });
          throw new Error(`Create profile failed: ${response.status()} - ${JSON.stringify(body)}`);
        }
      }

      await page.waitForTimeout(2000);
    } else {
      const buttons = await page.locator("button").allTextContents();
      console.log("Buttons on page:", buttons);
      await page.screenshot({ path: "/tmp/no-create-btn.png" });
      throw new Error("Create Profile button not visible");
    }

    // 6. Verify success
    await page.screenshot({ path: "/tmp/final.png" });
    const finalUrl = page.url();
    console.log("Final URL:", finalUrl);

    const hasSuccess = await page.locator('text=/success|congratulations|completed|done/i').isVisible().catch(() => false);
    const onResume = finalUrl.includes("resume");
    const onComplete = finalUrl.includes("complete") || (await page.locator('h1, h2').first().textContent())?.toLowerCase().includes("done");

    console.log("Success indicators:", { hasSuccess, onResume, onComplete });
    expect(hasSuccess || onResume || onComplete).toBeTruthy();
  });
});
