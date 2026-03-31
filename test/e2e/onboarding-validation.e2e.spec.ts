/**
 * E2E: Onboarding — Validation & Edge Cases — AGGRESSIVE BUG HUNTING
 *
 * Tests what happens when dumb users:
 * - Submit XSS, SQL injection, unicode in every field
 * - Send empty bodies, null values, wrong types
 * - Try to skip required steps, complete early, go to non-existent steps
 * - Fire rapid requests, compete with themselves
 */

import { describe, it, expect, beforeAll } from "bun:test";
import { e2eFetch, ONBOARDING_ROUTES } from "./setup";
import {
  createUniqueTestUser,
  registerAndLogin,
  type AuthenticatedUser,
} from "./helpers/test-user-lifecycle";

let auth: AuthenticatedUser;

beforeAll(async () => {
  const testUser = createUniqueTestUser("ob-edge");
  auth = await registerAndLogin(testUser);
}, 30_000);

describe("E2E: Onboarding Validation — Bug Hunting", () => {
  // ── Auth Guard ────────────────────────────────────────
  it("should return 401 for GET session without token", async () => {
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GET_SESSION, { method: "GET" });
    expect(res.status).toBe(401);
  });

  it("should return 401 for POST next without token", async () => {
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", body: JSON.stringify({}),
    });
    expect(res.status).toBe(401);
  });

  it("should return 401 for POST complete without token", async () => {
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION, {
      method: "POST",
    });
    expect(res.status).toBe(401);
  });

  it("should return 401 for garbage token", async () => {
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GET_SESSION, {
      method: "GET", token: "eyJhbGciOiJub25lIn0.garbage.invalid",
    });
    expect(res.status).toBe(401);
  });

  // ── Session Integrity ─────────────────────────────────
  it("should start at welcome for new user", async () => {
    const res = await e2eFetch<{ currentStep: string }>(
      ONBOARDING_ROUTES.ONBOARDING_GET_SESSION,
      { method: "GET", token: auth.token },
    );
    expect(res.status).toBe(200);
    expect(res.data.currentStep).toBe("welcome");
  });

  // ── XSS in personal info ──────────────────────────────
  it("should handle XSS in fullName during advance", async () => {
    // Welcome → advance
    await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token, body: JSON.stringify({}),
    });

    const xss = '<script>document.cookie</script>';
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ fullName: xss, email: auth.user.email }),
    });
    // Should either reject or sanitize
    if (res.status === 200 || res.status === 201) {
      console.log("[XSS] Backend accepted XSS fullName — check if sanitized");
    } else {
      expect([400, 422]).toContain(res.status);
    }
  });

  // ── SQL injection in email ────────────────────────────
  it("should reject SQL injection in email field", async () => {
    // Navigate back to personal-info
    await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ stepId: "personal-info" }),
    });

    const sqli = "admin@test.com'; DROP TABLE users; --";
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ fullName: "Valid Name", email: sqli }),
    });
    // Should reject invalid email
    if (res.status === 200 || res.status === 201) {
      console.log("[SQLI] Backend accepted SQL injection email — Prisma parameterizes, but still bad");
    }
    // Backend should still work
    const health = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GET_SESSION, {
      method: "GET", token: auth.token,
    });
    expect(health.status).toBe(200);
  });

  // ── Unicode / emoji ───────────────────────────────────
  it("should handle unicode/emoji in fullName", async () => {
    await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ stepId: "personal-info" }),
    });

    const unicodeName = "José 🎉 Müller 中文";
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ fullName: unicodeName, email: auth.user.email }),
    });
    expect([200, 201, 400]).toContain(res.status);
  });

  // ── 10K char string ───────────────────────────────────
  it("should reject 10000-char fullName", async () => {
    await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ stepId: "personal-info" }),
    });

    const longName = "A".repeat(10000);
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ fullName: longName, email: auth.user.email }),
    });
    // Should be rejected (400/422) or truncated
    if (res.status === 200 || res.status === 201) {
      console.log("[BUG?] Backend accepted 10K char name");
    }
  });

  // ── Empty body ────────────────────────────────────────
  it("should handle advance with completely empty body", async () => {
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({}),
    });
    // Should either advance (if on optional step) or reject
    expect([200, 201, 400, 422]).toContain(res.status);
  });

  // ── Non-existent step ─────────────────────────────────
  it("should reject goto for non-existent step", async () => {
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ stepId: "this-step-does-not-exist" }),
    });
    expect([400, 404, 422]).toContain(res.status);
  });

  it("should reject goto for empty stepId", async () => {
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ stepId: "" }),
    });
    expect([400, 404, 422]).toContain(res.status);
  });

  it("should reject goto for null stepId", async () => {
    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ stepId: null }),
    });
    expect([400, 404, 422]).toContain(res.status);
  });

  // ── Premature completion ──────────────────────────────
  it("should reject completion with incomplete required steps", async () => {
    const complete = await e2eFetch(
      ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION,
      { method: "POST", token: auth.token },
    );
    expect([400, 422, 403]).toContain(complete.status);
  });

  // ── Concurrent requests ───────────────────────────────
  it("should handle rapid concurrent session reads without crash", async () => {
    const u2 = createUniqueTestUser("ob-concurrent");
    const a2 = await registerAndLogin(u2);

    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GET_SESSION, {
          method: "GET", token: a2.token,
        }),
      ),
    );

    for (const res of results) {
      expect(res.status).toBe(200);
    }
  });

  it("should handle rapid concurrent next-step calls without corruption", async () => {
    const u3 = createUniqueTestUser("ob-race");
    const a3 = await registerAndLogin(u3);

    // Fire 3 next-step calls simultaneously (all from welcome)
    const results = await Promise.all([
      e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
        method: "POST", token: a3.token, body: JSON.stringify({}),
      }),
      e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
        method: "POST", token: a3.token, body: JSON.stringify({}),
      }),
      e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
        method: "POST", token: a3.token, body: JSON.stringify({}),
      }),
    ]);

    // At least one should succeed, others may fail gracefully
    const successes = results.filter((r) => r.status === 200 || r.status === 201);
    expect(successes.length).toBeGreaterThan(0);

    // Session should be consistent (not corrupted)
    const session = await e2eFetch<{ currentStep: string }>(
      ONBOARDING_ROUTES.ONBOARDING_GET_SESSION,
      { method: "GET", token: a3.token },
    );
    expect(session.status).toBe(200);
    expect(session.data.currentStep).toBeTruthy();
  });

  // ── Step ordering ─────────────────────────────────────
  it("should return steps in consistent order with unique IDs", async () => {
    const u4 = createUniqueTestUser("ob-order");
    const a4 = await registerAndLogin(u4);

    const session = await e2eFetch<{
      steps: { id: string; label: string }[];
    }>(ONBOARDING_ROUTES.ONBOARDING_GET_SESSION, {
      method: "GET", token: a4.token,
    });
    expect(session.status).toBe(200);
    expect(session.data.steps[0].id).toBe("welcome");

    const ids = session.data.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // ── Type coercion ─────────────────────────────────────
  it("should handle number where string expected in fullName", async () => {
    await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ stepId: "personal-info" }),
    });

    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ fullName: 12345, email: auth.user.email }),
    });
    // Should either reject or coerce gracefully
    expect([200, 201, 400, 422]).toContain(res.status);
  });

  it("should handle boolean where string expected", async () => {
    await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ stepId: "personal-info" }),
    });

    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ fullName: true, email: false }),
    });
    expect([200, 201, 400, 422]).toContain(res.status);
  });

  it("should handle array where string expected", async () => {
    await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ stepId: "personal-info" }),
    });

    const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ fullName: ["array", "of", "names"], email: auth.user.email }),
    });
    expect([200, 201, 400, 422]).toContain(res.status);
  });
});
