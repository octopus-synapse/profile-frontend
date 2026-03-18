/**
 * Debug auth flow for E2E tests
 */

const ADMIN_USER = {
  email: "admin@example.com",
  password: "Admin123!@#",
};

async function debugAuth() {
  console.log("Testing auth flow...");

  // Login (note: auth routes don't use /v1 prefix)
  const loginResp = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ADMIN_USER),
  });

  console.log("Login status:", loginResp.status);
  const loginData = await loginResp.json();
  console.log("Login success:", loginData.success);

  if (!loginData.success) {
    console.log("Login error:", loginData.error);
    return;
  }

  const token = loginData.data?.accessToken;
  console.log("Token received:", !!token);
  console.log("Token preview:", token?.substring(0, 50) + "...");

  // Test endpoint without token
  const noAuthResp = await fetch(
    "http://localhost:3001/api/v1/admin/section-types"
  );
  console.log("No auth status:", noAuthResp.status);

  // Test endpoint with token
  const listResp = await fetch(
    "http://localhost:3001/api/v1/admin/section-types",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log("With auth status:", listResp.status);
  const listData = await listResp.json();
  console.log("List data:", JSON.stringify(listData, null, 2).substring(0, 500));
}

debugAuth().catch(console.error);
