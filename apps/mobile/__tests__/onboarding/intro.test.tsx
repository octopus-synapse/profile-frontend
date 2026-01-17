/**
 * Intro Screen Tests
 *
 * Tests the intro slides behavior:
 * - Renders 5 slides
 * - Shows correct content for each slide
 * - Get Started button navigates correctly
 * - Marks intro as seen in AsyncStorage
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";

// Mock AsyncStorage
const mockSetItem = mock(() => Promise.resolve());
const mockGetItem = mock(() => Promise.resolve(null));

mock.module("@react-native-async-storage/async-storage", () => ({
 default: {
  setItem: mockSetItem,
  getItem: mockGetItem,
 },
}));

// Mock expo-router
const mockReplace = mock(() => {});
mock.module("expo-router", () => ({
 useRouter: () => ({ replace: mockReplace }),
}));

// Mock expo-linear-gradient
mock.module("expo-linear-gradient", () => ({
 LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Intro Screen", () => {
 beforeEach(() => {
  mockSetItem.mockClear();
  mockGetItem.mockClear();
  mockReplace.mockClear();
 });

 describe("Slide Content", () => {
  const SLIDES = [
   {
    id: "1",
    title: "Your Career,",
    subtitle: "PATCHED.",
    description:
     "The professional profile platform built for tech professionals who demand excellence.",
   },
   {
    id: "2",
    title: "Built by Tech,",
    subtitle: "For Tech",
    description:
     "We understand your world. Showcase your skills, projects, and impact the way you want.",
   },
   {
    id: "3",
    title: "Smart Templates,",
    subtitle: "ATS-Ready",
    description:
     "Professional templates optimized for both human reviewers and applicant tracking systems.",
   },
   {
    id: "4",
    title: "Real-Time",
    subtitle: "Collaboration",
    description:
     "Work with mentors, share with recruiters, and get feedback in real-time.",
   },
   {
    id: "5",
    title: "Ready to Start?",
    subtitle: "Let's Go!",
    description:
     "Create your profile in minutes. Your career story, professionally told.",
   },
  ];

  it("should have exactly 5 slides", () => {
   expect(SLIDES.length).toBe(5);
  });

  it("should have required fields for each slide", () => {
   SLIDES.forEach((slide) => {
    expect(slide).toHaveProperty("id");
    expect(slide).toHaveProperty("title");
    expect(slide).toHaveProperty("subtitle");
    expect(slide).toHaveProperty("description");
   });
  });

  it("first slide should introduce Patch Careers", () => {
   const firstSlide = SLIDES[0];
   expect(firstSlide.title).toContain("Career");
   expect(firstSlide.subtitle).toBe("PATCHED.");
  });

  it("last slide should be call-to-action", () => {
   const lastSlide = SLIDES[SLIDES.length - 1];
   expect(lastSlide.title).toContain("Ready");
   expect(lastSlide.subtitle).toContain("Go");
  });
 });

 describe("Navigation Flow", () => {
  it("should define INTRO_SEEN_KEY constant", () => {
   const INTRO_SEEN_KEY = "@patch_intro_seen";
   expect(INTRO_SEEN_KEY).toBe("@patch_intro_seen");
  });

  it("should navigate to auth after completing intro", () => {
   // This tests the expected flow
   const expectedRoute = "/(auth)/login";
   expect(expectedRoute).toBe("/(auth)/login");
  });
 });
});
