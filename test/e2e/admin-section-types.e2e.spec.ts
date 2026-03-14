/**
 * E2E Tests: Admin Section Types API
 *
 * Tests the section types CRUD API from the frontend perspective.
 * Requires backend to be running with database seeded.
 *
 * Run: bun test test/e2e/admin-section-types.e2e.spec.ts
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import {
 ACCOUNT_LIFECYCLE_ROUTES,
 ADMIN_SECTION_TYPES_ROUTES,
 AUTHENTICATION_ROUTES,
 E2E_CONFIG,
 e2eFetch,
 skipIfBackendUnavailable,
} from "./setup";

interface SectionTypeTranslation {
 title: string;
 label: string;
 noDataLabel?: string;
 placeholder?: string;
 addLabel?: string;
}

interface SectionType {
 key: string;
 slug: string;
 version: number;
 semanticKind: string;
 title: string;
 isActive: boolean;
 isSystem: boolean;
 isRepeatable: boolean;
 minItems: number;
 maxItems: number | null;
 iconType: string;
 icon: string;
 translations: Record<string, SectionTypeTranslation> | null;
}

interface PaginatedResponse<T> {
 items: T[];
 total: number;
 page: number;
 pageSize: number;
 totalPages: number;
}

interface AuthTokens {
 accessToken: string;
}

// Test admin user (must exist in database with ADMIN role)
const ADMIN_USER = {
 email: "admin@example.com",
 password: "Admin123!@#",
};

// Test key for created section types (will be cleaned up)
const TEST_SECTION_KEY = "test_custom_section_v1";

describe("Admin Section Types API E2E", () => {
 let adminToken: string;
 let createdSectionKey: string | null = null;

 beforeAll(async () => {
  await skipIfBackendUnavailable();

  // Login as admin
  const loginResult = await e2eFetch<AuthTokens>(
   AUTHENTICATION_ROUTES.AUTH_LOGIN,
   {
    method: "POST",
    body: JSON.stringify({
     email: ADMIN_USER.email,
     password: ADMIN_USER.password,
    }),
   }
  );

  if (loginResult.status !== 200 && loginResult.status !== 201) {
   throw new Error(
    `Admin login failed (${loginResult.status}). Make sure admin user exists with ADMIN role.`
   );
  }

  adminToken = loginResult.data.accessToken;
 });

 // Cleanup after all tests
 afterAll(async () => {
  if (createdSectionKey) {
   try {
    await e2eFetch(
     ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_DELETE.replace(
      ":key",
      createdSectionKey
     ),
     {
      method: "DELETE",
      token: adminToken,
     }
    );
   } catch {
    // Ignore cleanup errors
   }
  }
 });

 describe("Authentication & Authorization", () => {
  it("should return 401 for unauthenticated requests", async () => {
   // Add timestamp to avoid cache
   const result = await e2eFetch<unknown>(
    `${ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_LIST}?_nocache=${Date.now()}`
   );
   console.log("No auth test - status:", result.status, "data:", JSON.stringify(result.data).substring(0, 100));

   expect(result.status).toBe(401);
  });

  it("should return 403 for non-admin users", async () => {
   // Create a regular user
   const timestamp = Date.now();
   const regularUser = {
    email: `regular-${timestamp}@example.com`,
    password: "RegularPassword123!",
    name: "Regular User",
   };

   // Register
   await e2eFetch(ACCOUNT_LIFECYCLE_ROUTES.ACCOUNTS_SIGNUP, {
    method: "POST",
    body: JSON.stringify(regularUser),
   });

   // Login
   const loginResult = await e2eFetch<AuthTokens>(
    AUTHENTICATION_ROUTES.AUTH_LOGIN,
    {
     method: "POST",
     body: JSON.stringify({
      email: regularUser.email,
      password: regularUser.password,
     }),
    }
   );

   if (loginResult.status !== 200 && loginResult.status !== 201) {
    throw new Error("Regular user login failed");
   }

   // Try to access admin endpoint
   const result = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_LIST,
    { token: loginResult.data.accessToken }
   );

   expect(result.status).toBe(403);
  });
 });

 describe("List Section Types", () => {
  it("should list section types with default pagination", async () => {
   const result = await e2eFetch<PaginatedResponse<SectionType>>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_LIST,
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.items).toBeInstanceOf(Array);
   expect(result.data.page).toBe(1);
   expect(result.data.pageSize).toBeGreaterThan(0);
   expect(result.data.total).toBeGreaterThan(0);
  });

  it("should support pagination parameters", async () => {
   const result = await e2eFetch<PaginatedResponse<SectionType>>(
    `${ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_LIST}?page=1&pageSize=5`,
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.items.length).toBeLessThanOrEqual(5);
   expect(result.data.pageSize).toBe(5);
  });

  it("should support search filter", async () => {
   const result = await e2eFetch<PaginatedResponse<SectionType>>(
    `${ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_LIST}?search=experience`,
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   // Should find work_experience
   const keys = result.data.items.map((st) => st.key);
   const hasExperience = keys.some(
    (k) => k.includes("experience") || result.data.items.some((st) => st.title.toLowerCase().includes("experience"))
   );
   expect(hasExperience).toBe(true);
  });

  it("should support isActive filter", async () => {
   const result = await e2eFetch<PaginatedResponse<SectionType>>(
    `${ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_LIST}?isActive=true`,
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.items.every((st) => st.isActive)).toBe(true);
  });

  it("should support semanticKind filter", async () => {
   const result = await e2eFetch<PaginatedResponse<SectionType>>(
    `${ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_LIST}?semanticKind=WORK_EXPERIENCE`,
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.items.every((st) => st.semanticKind === "WORK_EXPERIENCE")).toBe(true);
  });
 });

 describe("Get Semantic Kinds", () => {
  it("should return list of unique semantic kinds", async () => {
   const result = await e2eFetch<string[]>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_SEMANTIC_KINDS,
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data).toBeInstanceOf(Array);
   expect(result.data.length).toBeGreaterThan(0);
   expect(result.data).toContain("WORK_EXPERIENCE");
   expect(result.data).toContain("EDUCATION");
  });
 });

 describe("Get Section Type", () => {
  it("should get a section type by key", async () => {
   const result = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_GET.replace(
     ":key",
     "work_experience_v1"
    ),
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.key).toBe("work_experience_v1");
   expect(result.data.slug).toBe("work_experience");
   expect(result.data.version).toBe(1);
   expect(result.data.semanticKind).toBe("WORK_EXPERIENCE");
   expect(result.data.isSystem).toBe(true);
  });

  it("should return 404 for non-existent key", async () => {
   const result = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_GET.replace(
     ":key",
     "non_existent_section_v999"
    ),
    { token: adminToken }
   );

   expect(result.status).toBe(404);
  });

  it("should include translations in response", async () => {
   const result = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_GET.replace(
     ":key",
     "work_experience_v1"
    ),
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.translations).toBeDefined();
   if (result.data.translations) {
    expect(result.data.translations["en"]).toBeDefined();
    expect(result.data.translations["pt-BR"]).toBeDefined();
    expect(result.data.translations["es"]).toBeDefined();
   }
  });

  it("should include icon in response", async () => {
   const result = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_GET.replace(
     ":key",
     "work_experience_v1"
    ),
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.iconType).toBeDefined();
   expect(result.data.icon).toBeDefined();
  });
 });

 describe("Create Section Type", () => {
  it("should create a new custom section type", async () => {
   const newSectionType = {
    key: TEST_SECTION_KEY,
    slug: "test_custom_section",
    version: 1,
    semanticKind: "CUSTOM",
    title: "Test Custom Section",
    isRepeatable: true,
    minItems: 0,
    maxItems: 10,
    iconType: "emoji",
    icon: "🧪",
    definition: { type: "custom", fields: [] }, // Required field
    translations: {
     en: {
      title: "Test Section",
      label: "test",
      noDataLabel: "No test data",
      placeholder: "Add test data",
      addLabel: "Add Test",
     },
     "pt-BR": {
      title: "Seção de Teste",
      label: "teste",
      noDataLabel: "Sem dados de teste",
      placeholder: "Adicionar dados de teste",
      addLabel: "Adicionar Teste",
     },
     es: {
      title: "Sección de Prueba",
      label: "prueba",
      noDataLabel: "Sin datos de prueba",
      placeholder: "Agregar datos de prueba",
      addLabel: "Agregar Prueba",
     },
    },
   };

   const result = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_CREATE,
    {
     method: "POST",
     body: JSON.stringify(newSectionType),
     token: adminToken,
    }
   );

   expect(result.status).toBe(201);
   expect(result.data.key).toBe(TEST_SECTION_KEY);
   expect(result.data.isSystem).toBe(false);
   expect(result.data.translations).toBeDefined();

   createdSectionKey = result.data.key;
  });

  it("should reject invalid key format", async () => {
   const invalidSection = {
    key: "Invalid-Key",
    slug: "invalid_key",
    version: 1,
    semanticKind: "CUSTOM",
    title: "Invalid Section",
    definition: { type: "custom", fields: [] },
   };

   const result = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_CREATE,
    {
     method: "POST",
     body: JSON.stringify(invalidSection),
     token: adminToken,
    }
   );

   expect(result.status).toBe(400);
  });

  it("should reject duplicate key", async () => {
   const duplicateSection = {
    key: "work_experience_v1",
    slug: "work_experience",
    version: 1,
    semanticKind: "WORK_EXPERIENCE",
    title: "Duplicate Work Experience",
    definition: { type: "custom", fields: [] },
   };

   const result = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_CREATE,
    {
     method: "POST",
     body: JSON.stringify(duplicateSection),
     token: adminToken,
    }
   );

   expect(result.status).toBe(409);
  });
 });

 describe("Update Section Type", () => {
  it("should update a custom section type", async () => {
   if (!createdSectionKey) {
    throw new Error("No section type was created for update test");
   }

   const updates = {
    title: "Updated Test Section",
    icon: "✨",
    translations: {
     en: {
      title: "Updated Test Section",
      label: "updated-test",
     },
    },
   };

   const result = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_UPDATE.replace(
     ":key",
     createdSectionKey
    ),
    {
     method: "PATCH",
     body: JSON.stringify(updates),
     token: adminToken,
    }
   );

   expect(result.status).toBe(200);
   expect(result.data.title).toBe("Updated Test Section");
   expect(result.data.icon).toBe("✨");
  });

  it("should allow icon/translation updates on system types", async () => {
   const updates = {
    icon: "🔧",
    translations: {
     en: {
      title: "Work Experience (Updated)",
      label: "work-updated",
     },
    },
   };

   const result = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_UPDATE.replace(
     ":key",
     "work_experience_v1"
    ),
    {
     method: "PATCH",
     body: JSON.stringify(updates),
     token: adminToken,
    }
   );

   expect(result.status).toBe(200);
   expect(result.data.icon).toBe("🔧");

   // Restore original
   await e2eFetch(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_UPDATE.replace(
     ":key",
     "work_experience_v1"
    ),
    {
     method: "PATCH",
     body: JSON.stringify({ icon: "💼" }),
     token: adminToken,
    }
   );
  });

  it("should reject key/semanticKind changes on system types", async () => {
   const updates = {
    key: "new_work_experience_v1",
    semanticKind: "CUSTOM",
   };

   const result = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_UPDATE.replace(
     ":key",
     "work_experience_v1"
    ),
    {
     method: "PATCH",
     body: JSON.stringify(updates),
     token: adminToken,
    }
   );

   expect(result.status).toBe(400);
  });

  it("should return 404 for non-existent key", async () => {
   const result = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_UPDATE.replace(
     ":key",
     "non_existent_v999"
    ),
    {
     method: "PATCH",
     body: JSON.stringify({ title: "Updated" }),
     token: adminToken,
    }
   );

   expect(result.status).toBe(404);
  });
 });

 describe("Delete Section Type", () => {
  it("should delete an unused custom section type", async () => {
   // Create a section to delete
   const toDelete = {
    key: "to_delete_section_v1",
    slug: "to_delete_section",
    version: 1,
    semanticKind: "CUSTOM",
    title: "Section To Delete",
    definition: { type: "custom", fields: [] },
   };

   const createResult = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_CREATE,
    {
     method: "POST",
     body: JSON.stringify(toDelete),
     token: adminToken,
    }
   );

   expect(createResult.status).toBe(201);

   // Delete it
   const deleteResult = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_DELETE.replace(
     ":key",
     "to_delete_section_v1"
    ),
    {
     method: "DELETE",
     token: adminToken,
    }
   );

   expect(deleteResult.status).toBe(204);

   // Verify it's gone
   const getResult = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_GET.replace(
     ":key",
     "to_delete_section_v1"
    ),
    { token: adminToken }
   );

   expect(getResult.status).toBe(404);
  });

  it("should reject deletion of system types", async () => {
   const result = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_DELETE.replace(
     ":key",
     "work_experience_v1"
    ),
    {
     method: "DELETE",
     token: adminToken,
    }
   );

   expect(result.status).toBe(400);
  });

  it("should return 404 for non-existent key", async () => {
   const result = await e2eFetch<unknown>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_DELETE.replace(
     ":key",
     "non_existent_v999"
    ),
    {
     method: "DELETE",
     token: adminToken,
    }
   );

   expect(result.status).toBe(404);
  });
 });

 describe("i18n Integration", () => {
  it("should return translations for all supported locales", async () => {
   const result = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_GET.replace(
     ":key",
     "education_v1"
    ),
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.translations).toBeDefined();

   const translations = result.data.translations!;
   
   // Check English
   expect(translations["en"]).toBeDefined();
   expect(translations["en"].title).toBeDefined();
   expect(translations["en"].label).toBeDefined();

   // Check Portuguese
   expect(translations["pt-BR"]).toBeDefined();
   expect(translations["pt-BR"].title).toBeDefined();

   // Check Spanish
   expect(translations["es"]).toBeDefined();
   expect(translations["es"].title).toBeDefined();
  });

  it("should have correct translations for work experience", async () => {
   const result = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_GET.replace(
     ":key",
     "work_experience_v1"
    ),
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   const translations = result.data.translations!;

   expect(translations["en"].title).toBe("Work Experience");
   expect(translations["pt-BR"].title).toBe("Experiência Profissional");
   expect(translations["es"].title).toBe("Experiencia Laboral");
  });
 });

 describe("Icon System", () => {
  it("should support emoji icons", async () => {
   const result = await e2eFetch<SectionType>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_GET.replace(
     ":key",
     "work_experience_v1"
    ),
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.iconType).toBe("emoji");
   expect(result.data.icon).toBeDefined();
  });

  it("should list section types with icon data", async () => {
   const result = await e2eFetch<PaginatedResponse<SectionType>>(
    ADMIN_SECTION_TYPES_ROUTES.ADMIN_SECTION_TYPES_LIST,
    { token: adminToken }
   );

   expect(result.status).toBe(200);
   expect(result.data.items.every((st) => st.iconType && st.icon)).toBe(true);
  });
 });
});
