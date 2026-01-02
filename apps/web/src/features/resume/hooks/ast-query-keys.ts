/**
 * Resume AST Query Keys
 */

export const astKeys = {
  all: ["ast"] as const,
  renders: () => [...astKeys.all, "render"] as const,
  render: (resumeId: string, target: "html" | "pdf" = "html") =>
    [...astKeys.renders(), resumeId, target] as const,
  publicRenders: () => [...astKeys.all, "public"] as const,
  publicRender: (slug: string, target: "html" | "pdf" = "html") =>
    [...astKeys.publicRenders(), slug, target] as const,
};
