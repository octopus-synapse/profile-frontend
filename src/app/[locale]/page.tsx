"use client";

import Link from "next/link";
import {
  Github,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  FileText,
  Menu,
  Terminal,
  Code2,
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import { ThemeToggleSimple } from "@/shared/components/ui/theme-toggle";

/**
 * Home Page
 * Developer-inspired landing page with code aesthetic
 */
export default function HomePage() {
  return (
    <div className="bg-pf-canvas-default flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="border-pf-border-muted bg-pf-canvas-default/80 relative z-10 border-b backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex h-7 w-7 items-center justify-center">
              <Terminal className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="text-pf-fg-default font-mono text-sm font-semibold">profile</span>
            <span className="dev-badge">dev</span>
          </Link>

          {/* Center Links - Desktop */}
          <div className="hidden items-center gap-8 lg:flex">
            <Link
              href="#features"
              className="text-pf-fg-muted hover:text-pf-fg-default font-mono text-xs transition-colors"
            >
              features
            </Link>
            <Link
              href="#pricing"
              className="text-pf-fg-muted hover:text-pf-fg-default font-mono text-xs transition-colors"
            >
              pricing
            </Link>
            <Link
              href="/docs"
              className="text-pf-fg-muted hover:text-pf-fg-default font-mono text-xs transition-colors"
            >
              docs
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggleSimple />
            <Link
              href={ROUTES.AUTH.SIGN_IN}
              className="text-pf-fg-muted hover:text-pf-fg-default hidden font-mono text-xs transition-colors sm:block"
            >
              sign in
            </Link>
            <Link
              href={ROUTES.AUTH.SIGN_UP}
              className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis hidden items-center gap-2 px-4 py-2 font-mono text-xs transition-opacity hover:opacity-90 sm:flex"
            >
              <Terminal className="h-3.5 w-3.5" strokeWidth={1.5} />
              get started
            </Link>
            <button className="text-pf-fg-default hover:text-pf-fg-muted flex h-9 w-9 items-center justify-center transition-colors lg:hidden">
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 flex-col">
        <section className="flex flex-1 flex-col items-center justify-center px-4 py-20">
          <div className="max-w-4xl space-y-8 text-center">
            {/* Terminal Badge */}
            <div className="inline-flex items-center gap-2">
              <span className="dev-badge">
                <span className="text-code-string">●</span> v1.0.0
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-pf-fg-default text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your developer profile,
              <br />
              <span className="text-pf-fg-muted font-normal">beautifully crafted</span>
            </h1>

            {/* Code Block Subtitle */}
            <div className="mx-auto max-w-xl">
              <div className="code-block text-left">
                <div className="code-block-header">
                  <div className="code-block-dots">
                    <span className="code-block-dot red" />
                    <span className="code-block-dot yellow" />
                    <span className="code-block-dot green" />
                  </div>
                  <span className="code-block-title">profile.config.ts</span>
                </div>
                <div className="code-block-content">
                  <div>
                    <span className="code-keyword">export const</span>{" "}
                    <span className="code-variable">developer</span> = {"{"}
                  </div>
                  <div className="ml-4">
                    <span className="code-function">name</span>:{" "}
                    <span className="code-string">&quot;Your Name&quot;</span>,
                  </div>
                  <div className="ml-4">
                    <span className="code-function">title</span>:{" "}
                    <span className="code-string">&quot;Full-Stack Developer&quot;</span>,
                  </div>
                  <div className="ml-4">
                    <span className="code-function">status</span>:{" "}
                    <span className="code-string">&quot;open_to_work&quot;</span>,
                  </div>
                  <div className="ml-4">
                    <span className="code-function">skills</span>: [
                    <span className="code-string">&quot;React&quot;</span>,{" "}
                    <span className="code-string">&quot;Node&quot;</span>,{" "}
                    <span className="code-string">&quot;...&quot;</span>],
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Link
                href={ROUTES.AUTH.SIGN_UP}
                className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis group inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm transition-opacity hover:opacity-90"
              >
                <Terminal className="h-4 w-4" strokeWidth={1.5} />
                npm create profile
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
              <Link
                href={ROUTES.AUTH.SIGN_IN}
                className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle inline-flex items-center justify-center gap-2 border bg-transparent px-6 py-3 font-mono text-sm transition-colors"
              >
                <Github className="h-4 w-4" strokeWidth={1.5} />
                Sign in with GitHub
              </Link>
            </div>

            {/* Social proof */}
            <p className="text-pf-fg-subtle pt-4 font-mono text-xs">
              <span className="text-pf-success-fg">✓</span> Trusted by{" "}
              <span className="text-pf-fg-muted font-semibold">1,000+</span> developers
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="border-pf-border-muted bg-pf-canvas-subtle/50 border-t py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2">
                <Code2 className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
                <span className="text-pf-fg-muted font-mono text-xs">// Features</span>
              </div>
              <h2 className="text-pf-fg-default text-2xl font-bold tracking-tight sm:text-3xl">
                Everything you need to stand out
              </h2>
              <p className="text-pf-fg-muted mt-4 font-mono text-sm">
                Powerful features for building your professional presence
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<User className="h-5 w-5" />}
                title="professional_profile"
                description="Showcase your skills, experience, and projects in a beautiful, customizable layout."
              />
              <FeatureCard
                icon={<FileText className="h-5 w-5" />}
                title="resume_export"
                description="Export your profile as PDF or DOCX with multiple templates. ATS-friendly."
              />
              <FeatureCard
                icon={<Github className="h-5 w-5" />}
                title="github_sync"
                description="Sync your repositories, contributions, and activity automatically."
              />
              <FeatureCard
                icon={<Zap className="h-5 w-5" />}
                title="analytics"
                description="Track profile views, link clicks, and engagement in real-time."
              />
              <FeatureCard
                icon={<Shield className="h-5 w-5" />}
                title="privacy_control"
                description="Control exactly what's visible. Make sections public, private, or share with specific people."
              />
              <FeatureCard
                icon={<Sparkles className="h-5 w-5" />}
                title="ai_powered"
                description="Get AI suggestions to improve your profile content and make it more impactful."
              />
            </div>
          </div>
        </section>

        {/* Terminal CTA Section */}
        <section className="border-pf-border-muted border-t py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
            <div className="terminal mx-auto max-w-lg text-left">
              <div className="terminal-header">
                <div className="code-block-dots">
                  <span className="code-block-dot red" />
                  <span className="code-block-dot yellow" />
                  <span className="code-block-dot green" />
                </div>
                <span className="code-block-title">~/workspace</span>
              </div>
              <div className="terminal-content">
                <div>
                  <span className="terminal-prompt">➜</span>{" "}
                  <span className="terminal-command">npx create-profile@latest</span>
                </div>
                <div className="terminal-output mt-2">
                  <div className="text-pf-success-fg">✔ Profile created successfully!</div>
                  <div className="text-pf-fg-muted mt-1">
                    Your profile is live at: profile.dev/yourname
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Link
                href={ROUTES.AUTH.SIGN_UP}
                className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis group inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm transition-opacity hover:opacity-90"
              >
                Get Started for Free
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-pf-border-muted bg-pf-canvas-default relative z-10 border-t">
        <div className="px-6 py-8 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex h-6 w-6 items-center justify-center">
                <Terminal className="h-3.5 w-3.5" strokeWidth={1.5} />
              </div>
              <span className="text-pf-fg-default font-mono text-xs font-semibold">profile</span>
            </div>
            <p className="text-pf-fg-muted font-mono text-xs">
              © {new Date().getFullYear()} ProFile. All rights reserved.
            </p>
            <div className="text-pf-fg-muted flex gap-6 font-mono text-xs">
              <Link href="/privacy" className="hover:text-pf-fg-default transition-colors">
                privacy
              </Link>
              <Link href="/terms" className="hover:text-pf-fg-default transition-colors">
                terms
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pf-fg-default transition-colors"
              >
                github
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group border-pf-border-default bg-pf-canvas-overlay hover:border-pf-border-emphasis p-6 transition-all">
      <div className="text-pf-fg-muted group-hover:text-pf-fg-default mb-4 transition-colors">
        {icon}
      </div>
      <h3 className="text-pf-fg-default mb-2 font-mono text-sm font-semibold">{title}</h3>
      <p className="text-pf-fg-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}
