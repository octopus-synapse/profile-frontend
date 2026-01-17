/**
 * DSL Repository
 * Handles DSL compilation and validation via API
 */

import type { HttpClient } from "../client";

export interface DslValidationResult {
 valid: boolean;
 errors: string[] | null;
}

export interface DslPreviewResult {
 ast: unknown;
}

export interface DslRenderResult {
 ast: unknown;
 resumeId?: string;
 slug?: string;
}

export function createDslRepository(client: HttpClient) {
 return {
  /**
   * Validate DSL without compiling
   */
  async validate(dsl: unknown): Promise<DslValidationResult> {
   return client.post<DslValidationResult>("/v1/dsl/validate", dsl);
  },

  /**
   * Preview: Compile DSL to AST without persisting
   */
  async preview(
   dsl: unknown,
   target: "html" | "pdf" = "html"
  ): Promise<DslPreviewResult> {
   return client.post<DslPreviewResult>(
    `/v1/dsl/preview?target=${target}`,
    dsl
   );
  },

  /**
   * Render: Get compiled AST for a persisted resume
   */
  async render(
   resumeId: string,
   target: "html" | "pdf" = "html"
  ): Promise<DslRenderResult> {
   return client.get<DslRenderResult>(
    `/v1/dsl/render/${resumeId}?target=${target}`
   );
  },

  /**
   * Render public: Get compiled AST for a public resume by slug
   */
  async renderPublic(
   slug: string,
   target: "html" | "pdf" = "html"
  ): Promise<DslRenderResult> {
   return client.get<DslRenderResult>(
    `/v1/dsl/render/public/${slug}?target=${target}`
   );
  },
 };
}

export type DslRepository = ReturnType<typeof createDslRepository>;
