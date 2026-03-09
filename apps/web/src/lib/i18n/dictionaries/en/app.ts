/**
 * English translations - App Pages (Dashboard, Errors, etc.)
 */

export const app = {
  // Dashboard
  "app.dashboard.title": "Dashboard",
  "app.dashboard.welcome": "Welcome back,",
  "app.dashboard.developer": "developer",
  "app.dashboard.authenticated": "authenticated: true",
  "app.dashboard.status.profile": "incomplete",
  "app.dashboard.status.resume": "draft",
  "app.dashboard.status.visibility": "private",
  "app.dashboard.quickActions": "Quick Actions",
  "app.dashboard.editProfile": "Edit Profile",
  "app.dashboard.editProfileDesc": "Update your information",
  "app.dashboard.viewResume": "View Resume",
  "app.dashboard.viewResumeDesc": "Preview your resume",
  "app.dashboard.settings": "Settings",
  "app.dashboard.settingsDesc": "Manage preferences",

  // Home Page
  "app.home.ready": "ready",
  "app.home.title": "Your developer profile,",
  "app.home.titleHighlight": "beautifully crafted",
  "app.home.features.portfolio": "A beautiful portfolio",
  "app.home.features.resume": "Professional resume",
  "app.home.features.analytics": "Real-time analytics",
  "app.home.cta.getStarted": "Get Started",
  "app.home.cta.viewDemo": "View Demo",

  // Unauthorized Page
  "app.unauthorized.title": "Access Denied",
  "app.unauthorized.description":
    "You don't have permission to access this page. Please contact an administrator if you believe this is an error.",
  "app.unauthorized.goHome": "go_home()",
  "app.unauthorized.tryDifferent": "try_different_account()",
  "app.unauthorized.errorCode": "error.code",
  "app.unauthorized.forbidden": "FORBIDDEN",
  "app.unauthorized.checkPermissions": "Please check your permissions",

  // Not Found Page
  "app.notFound.title": "Page not found",
  "app.notFound.description": "The page you're looking for doesn't exist or has been moved.",
  "app.notFound.goHome": "go_home()",
  "app.notFound.goBack": "go_back()",

  // Onboarding
  "app.onboarding.title": "Setup Your Profile",
  "app.onboarding.description": "Complete your professional profile setup in minutes",

  // Onboarding Steps
  "app.onboarding.step.technicalSkills": "Technical Skills",
  "app.onboarding.step.technicalSkillsDesc": "Select your skills or search from our catalog",
  "app.onboarding.step.back": "back",
  "app.onboarding.step.skip": "skip",
  "app.onboarding.step.continue": "continue",
  "app.onboarding.step.submit": "submit",
  "app.onboarding.step.processing": "processing...",
  "app.onboarding.step.noSkills": "I'm still developing my skills (skip for now)",
  "app.onboarding.step.skillsSelected": "{count} skill(s) selected",
  "app.onboarding.step.searchSkills": "Search skills (React, Python, Docker...)",
  "app.onboarding.step.addCustomSkill": "Add custom skill",
  "app.onboarding.step.customSkillPlaceholder": "Custom skill name...",
  "app.onboarding.step.category": "Category",
  "app.onboarding.step.levels": "Levels",
  "app.onboarding.step.noSkillsFound": "No skills found for \"{query}\"",

  // Skill Levels
  "app.skills.level.beginner": "Beginner",
  "app.skills.level.basic": "Basic",
  "app.skills.level.intermediate": "Intermediate",
  "app.skills.level.advanced": "Advanced",
  "app.skills.level.expert": "Expert",

  // Settings Page
  "app.settings.title": "Settings",
  "app.settings.description": "Manage your profile and preferences",
  "app.settings.backToDashboard": "Back to Dashboard",
  "app.settings.tabs.profile": "Profile",
  "app.settings.tabs.experience": "Experience",
  "app.settings.tabs.education": "Education",
  "app.settings.tabs.skills": "Skills",
  "app.settings.tabs.languages": "Languages",
  "app.settings.tabs.preferences": "Preferences",
} as const;
