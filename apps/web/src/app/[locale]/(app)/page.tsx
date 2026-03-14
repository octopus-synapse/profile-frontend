'use client';

import {
  ArrowRight,
  Code2,
  FileText,
  Github,
  Shield,
  Sparkles,
  Terminal,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';

/**
 * Home Page (App)
 * Dark theme matching landing page
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 flex-col">
        <section className="flex flex-1 flex-col items-center justify-center px-4 py-20">
          <div className="max-w-4xl space-y-8 text-center">
            {/* Terminal Badge */}
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-zinc-400">
                <span className="text-cyan-400">●</span> ready
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your developer profile,
              <br />
              <span className="font-normal text-zinc-500">beautifully crafted</span>
            </h1>

            {/* Code Block Subtitle */}
            <div className="mx-auto max-w-xl">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 border-b border-white/5 bg-black/30 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">welcome.ts</span>
                </div>
                <div className="p-4 font-mono text-[11px] leading-relaxed text-zinc-400">
                  <div>
                    <span className="text-pink-400">const</span>{' '}
                    <span className="text-cyan-300">features</span> = {'{'}
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">portfolio</span>:{' '}
                    <span className="text-emerald-400">&quot;showcase your work&quot;</span>,
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">resume</span>:{' '}
                    <span className="text-emerald-400">&quot;export to PDF/DOCX&quot;</span>,
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">analytics</span>:{' '}
                    <span className="text-emerald-400">&quot;track engagement&quot;</span>,
                  </div>
                  <div>{'}'}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Link
                href={ROUTES.AUTH.SIGN_UP}
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-cyan-500 px-6 py-3 font-mono text-sm text-white transition-all hover:bg-cyan-400"
              >
                <Terminal className="h-4 w-4" strokeWidth={1.5} />
                get_started()
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
              <Link
                href={ROUTES.AUTH.SIGN_IN}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-6 py-3 font-mono text-sm text-zinc-300 transition-all hover:bg-white/10"
              >
                <Github className="h-4 w-4" strokeWidth={1.5} />
                sign_in_with_github
              </Link>
            </div>

            {/* Social proof */}
            <p className="pt-4 font-mono text-xs text-zinc-500">
              <span className="text-cyan-400">✓</span> Trusted by{' '}
              <span className="font-semibold text-zinc-400">1,000+</span> developers
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-white/5 bg-black/30 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2">
                <Code2 className="h-5 w-5 text-zinc-500" strokeWidth={1.5} />
                <span className="font-mono text-xs text-zinc-500">{'//'} Features</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Everything you need to stand out
              </h2>
              <p className="mt-4 font-mono text-sm text-zinc-500">
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
        <section className="border-t border-white/5 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
            <div className="mx-auto max-w-lg overflow-hidden rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-white/5 bg-black/30 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-[10px] text-zinc-500">~/workspace</span>
              </div>
              <div className="p-4 text-left font-mono text-[11px] leading-relaxed text-zinc-400">
                <div>
                  <span className="text-cyan-400">➜</span>{' '}
                  <span className="text-white">npx create-patch@latest</span>
                </div>
                <div className="mt-2">
                  <div className="text-emerald-400">✔ Profile created successfully!</div>
                  <div className="mt-1 text-zinc-500">
                    Your profile is live at: patch.dev/yourname
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Link
                href={ROUTES.AUTH.SIGN_UP}
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-cyan-500 px-6 py-3 font-mono text-sm text-white transition-all hover:bg-cyan-400"
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
      <footer className="relative z-10 border-t border-white/5">
        <div className="px-6 py-8 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500">
                <Zap className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
              </div>
              <span className="font-mono text-xs font-bold text-white">PATCH</span>
            </div>
            <p className="font-mono text-xs text-zinc-500">
              © {new Date().getFullYear()} PATCH. All rights reserved.
            </p>
            <div className="flex gap-6 font-mono text-xs text-zinc-500">
              <Link href="/privacy" className="transition-colors hover:text-white">
                privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                terms
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
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
    <div className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-cyan-500/30 hover:bg-white/10">
      <div className="mb-4 text-zinc-500 transition-colors group-hover:text-cyan-400">{icon}</div>
      <h3 className="mb-2 font-mono text-sm font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}
