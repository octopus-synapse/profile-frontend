"use client";

import Link from "next/link";
import { Github, FileText, User, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { useT } from "@/features/i18n";
import { ROUTES } from "@/config/routes";

/**
 * Home Page
 * Landing page with call to action
 */
export default function HomePage() {
  const t = useT();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="max-w-3xl space-y-8 text-center">
          {/* Logo/Brand */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">ProFile</h1>
          </div>

          {/* Headline */}
          <h2 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Your professional developer profile,{" "}
            <span className="text-green-500">beautifully crafted</span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xl text-zinc-400">
            Create a stunning portfolio and resume that showcases your skills, projects, and
            experience. Stand out to recruiters and clients.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href={ROUTES.AUTH.SIGN_UP}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={ROUTES.AUTH.SIGN_IN}>{t("nav.signIn")}</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-6 pt-16 sm:grid-cols-3">
            <FeatureCard
              icon={<User className="h-6 w-6" />}
              title="Professional Profile"
              description="Showcase your skills, experience, and projects in a beautiful layout"
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Resume Export"
              description="Export your profile as PDF or DOCX with multiple templates"
            />
            <FeatureCard
              icon={<Github className="h-6 w-6" />}
              title="GitHub Integration"
              description="Sync your repositories and contributions automatically"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ProFile. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-zinc-300">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-zinc-300">
              Terms
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              GitHub
            </a>
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
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-left">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-green-500">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  );
}
