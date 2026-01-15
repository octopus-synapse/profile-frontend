/**
 * Resume Repository Tests
 *
 * Decision: Tests verify CRUD operations and nested resource management.
 * Repository handles complex nested resources (experiences, education, skills).
 *
 * Pattern: Comprehensive coverage of all endpoints with proper URL construction.
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { createResumeRepository } from "../repositories/resume.repository";
import type { HttpClient } from "../client";
import type { Resume, ResumeListItem } from "../types";

// ============================================================================
// Mock Factory
// ============================================================================

function createMockHttpClient(): HttpClient {
 return {
  get: mock(() => Promise.resolve({})),
  post: mock(() => Promise.resolve({})),
  put: mock(() => Promise.resolve({})),
  patch: mock(() => Promise.resolve({})),
  delete: mock(() => Promise.resolve(undefined)),
  setToken: mock(() => {}),
  clearToken: mock(() => {}),
 };
}

function createMockResume(overrides: Partial<Resume> = {}): Resume {
 return {
  id: "resume-123",
  title: "Software Engineer",
  slug: "software-engineer",
  summary: "Experienced developer",
  isPublic: false,
  userId: "user-123",
  themeId: null,
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
 } as Resume;
}

function createMockResumeListItem(): ResumeListItem {
 return {
  id: "resume-123",
  title: "Software Engineer",
  slug: "software-engineer",
  isPublic: false,
  updatedAt: new Date().toISOString(),
 };
}

// ============================================================================
// Tests
// ============================================================================

describe("ResumeRepository", () => {
 let client: HttpClient;
 let repository: ReturnType<typeof createResumeRepository>;

 beforeEach(() => {
  client = createMockHttpClient();
  repository = createResumeRepository(client);
 });

 // ==========================================================================
 // Resume CRUD
 // ==========================================================================

 describe("getAll", () => {
  it("calls GET /resumes", async () => {
   // Arrange
   const resumes = [createMockResumeListItem()];
   (client.get as ReturnType<typeof mock>).mockResolvedValue(resumes);

   // Act
   const result = await repository.getAll();

   // Assert
   expect(client.get).toHaveBeenCalledWith("/resumes");
   expect(result).toEqual(resumes);
  });
 });

 describe("getById", () => {
  it("calls GET /resumes/:id", async () => {
   // Arrange
   const resume = createMockResume();
   (client.get as ReturnType<typeof mock>).mockResolvedValue(resume);

   // Act
   const result = await repository.getById("resume-123");

   // Assert
   expect(client.get).toHaveBeenCalledWith("/resumes/resume-123");
   expect(result).toEqual(resume);
  });
 });

 describe("getBySlug", () => {
  it("calls GET /resumes/public/:slug", async () => {
   // Arrange
   const resume = createMockResume({ isPublic: true });
   (client.get as ReturnType<typeof mock>).mockResolvedValue(resume);

   // Act
   const result = await repository.getBySlug("software-engineer");

   // Assert
   expect(client.get).toHaveBeenCalledWith("/resumes/public/software-engineer");
   expect(result).toEqual(resume);
  });
 });

 describe("create", () => {
  it("calls POST /resumes with data", async () => {
   // Arrange
   const createData = { title: "New Resume" };
   const resume = createMockResume({ title: "New Resume" });
   (client.post as ReturnType<typeof mock>).mockResolvedValue(resume);

   // Act
   const result = await repository.create(createData);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/resumes", createData);
   expect(result.title).toBe("New Resume");
  });
 });

 describe("update", () => {
  it("calls PATCH /resumes/:id with data", async () => {
   // Arrange
   const updateData = { title: "Updated Title" };
   const resume = createMockResume({ title: "Updated Title" });
   (client.patch as ReturnType<typeof mock>).mockResolvedValue(resume);

   // Act
   const result = await repository.update("resume-123", updateData);

   // Assert
   expect(client.patch).toHaveBeenCalledWith("/resumes/resume-123", updateData);
   expect(result.title).toBe("Updated Title");
  });
 });

 describe("delete", () => {
  it("calls DELETE /resumes/:id", async () => {
   // Arrange
   (client.delete as ReturnType<typeof mock>).mockResolvedValue(undefined);

   // Act
   await repository.delete("resume-123");

   // Assert
   expect(client.delete).toHaveBeenCalledWith("/resumes/resume-123");
  });
 });

 describe("duplicate", () => {
  it("calls POST /resumes/:id/duplicate", async () => {
   // Arrange
   const duplicated = createMockResume({
    id: "resume-456",
    title: "Software Engineer (Copy)",
   });
   (client.post as ReturnType<typeof mock>).mockResolvedValue(duplicated);

   // Act
   const result = await repository.duplicate("resume-123");

   // Assert
   expect(client.post).toHaveBeenCalledWith("/resumes/resume-123/duplicate");
   expect(result.id).toBe("resume-456");
  });
 });

 // ==========================================================================
 // Experiences
 // ==========================================================================

 describe("experiences", () => {
  it("addExperience calls POST /resumes/:id/experiences", async () => {
   // Arrange
   const experienceData = {
    company: "Tech Corp",
    title: "Developer",
    startDate: "2020-01-01",
   };
   const experience = { id: "exp-1", ...experienceData };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(experience);

   // Act
   const result = await repository.addExperience(
    "resume-123",
    experienceData as any
   );

   // Assert
   expect(client.post).toHaveBeenCalledWith(
    "/resumes/resume-123/experiences",
    experienceData
   );
   expect(result.id).toBe("exp-1");
  });

  it("updateExperience calls PATCH /resumes/:id/experiences/:expId", async () => {
   // Arrange
   const updateData = { title: "Senior Developer" };
   (client.patch as ReturnType<typeof mock>).mockResolvedValue({
    id: "exp-1",
    ...updateData,
   });

   // Act
   await repository.updateExperience("resume-123", "exp-1", updateData);

   // Assert
   expect(client.patch).toHaveBeenCalledWith(
    "/resumes/resume-123/experiences/exp-1",
    updateData
   );
  });

  it("deleteExperience calls DELETE /resumes/:id/experiences/:expId", async () => {
   // Arrange
   (client.delete as ReturnType<typeof mock>).mockResolvedValue(undefined);

   // Act
   await repository.deleteExperience("resume-123", "exp-1");

   // Assert
   expect(client.delete).toHaveBeenCalledWith(
    "/resumes/resume-123/experiences/exp-1"
   );
  });

  it("reorderExperiences calls PATCH /resumes/:id/experiences/reorder", async () => {
   // Arrange
   const order = ["exp-2", "exp-1", "exp-3"];
   (client.patch as ReturnType<typeof mock>).mockResolvedValue([]);

   // Act
   await repository.reorderExperiences("resume-123", order);

   // Assert
   expect(client.patch).toHaveBeenCalledWith(
    "/resumes/resume-123/experiences/reorder",
    {
     order,
    }
   );
  });
 });

 // ==========================================================================
 // Education
 // ==========================================================================

 describe("education", () => {
  it("addEducation calls POST /resumes/:id/educations", async () => {
   // Arrange
   const educationData = {
    institution: "University",
    degree: "BSc",
    startDate: "2015-09-01",
   };
   (client.post as ReturnType<typeof mock>).mockResolvedValue({
    id: "edu-1",
    ...educationData,
   });

   // Act
   await repository.addEducation("resume-123", educationData as any);

   // Assert
   expect(client.post).toHaveBeenCalledWith(
    "/resumes/resume-123/educations",
    educationData
   );
  });

  it("updateEducation calls PATCH /resumes/:id/educations/:eduId", async () => {
   // Arrange
   const updateData = { degree: "MSc" };
   (client.patch as ReturnType<typeof mock>).mockResolvedValue({
    id: "edu-1",
    ...updateData,
   });

   // Act
   await repository.updateEducation("resume-123", "edu-1", updateData);

   // Assert
   expect(client.patch).toHaveBeenCalledWith(
    "/resumes/resume-123/educations/edu-1",
    updateData
   );
  });

  it("deleteEducation calls DELETE /resumes/:id/educations/:eduId", async () => {
   // Arrange
   (client.delete as ReturnType<typeof mock>).mockResolvedValue(undefined);

   // Act
   await repository.deleteEducation("resume-123", "edu-1");

   // Assert
   expect(client.delete).toHaveBeenCalledWith(
    "/resumes/resume-123/educations/edu-1"
   );
  });
 });

 // ==========================================================================
 // Skills
 // ==========================================================================

 describe("skills", () => {
  it("addSkill calls POST /resumes/:id/skills", async () => {
   // Arrange
   const skillData = { name: "TypeScript", level: 90 };
   (client.post as ReturnType<typeof mock>).mockResolvedValue({
    id: "skill-1",
    ...skillData,
   });

   // Act
   await repository.addSkill("resume-123", skillData as any);

   // Assert
   expect(client.post).toHaveBeenCalledWith(
    "/resumes/resume-123/skills",
    skillData
   );
  });

  it("updateSkill calls PATCH /resumes/:id/skills/:skillId", async () => {
   // Arrange
   const updateData = { level: 95 };
   (client.patch as ReturnType<typeof mock>).mockResolvedValue({
    id: "skill-1",
    ...updateData,
   });

   // Act
   await repository.updateSkill("resume-123", "skill-1", updateData);

   // Assert
   expect(client.patch).toHaveBeenCalledWith(
    "/resumes/resume-123/skills/skill-1",
    updateData
   );
  });

  it("deleteSkill calls DELETE /resumes/:id/skills/:skillId", async () => {
   // Arrange
   (client.delete as ReturnType<typeof mock>).mockResolvedValue(undefined);

   // Act
   await repository.deleteSkill("resume-123", "skill-1");

   // Assert
   expect(client.delete).toHaveBeenCalledWith(
    "/resumes/resume-123/skills/skill-1"
   );
  });
 });
});
