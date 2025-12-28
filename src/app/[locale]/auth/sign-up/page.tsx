"use client";

/**
 * Sign Up Page
 * Developer-inspired design with code aesthetic
 */

import { SignUpForm } from "@/features/auth";
import { LocalizedLink } from "@/shared/components/localized-link";
import { ROUTES } from "@/config/routes";
import { Terminal, Github, ArrowLeft, Check } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="bg-pf-canvas-default flex min-h-screen">
      {/* Left side - Terminal/Code aesthetic (hidden on mobile) */}
      <div className="bg-pf-canvas-subtle border-pf-border-muted hidden flex-col justify-between border-r p-12 lg:flex lg:w-1/2">
        <div>
          <LocalizedLink href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex h-8 w-8 items-center justify-center">
              <Terminal className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="text-pf-fg-default font-mono text-lg font-semibold">profile</span>
            <span className="dev-badge">dev</span>
          </LocalizedLink>
        </div>

        <div className="space-y-8">
          {/* Code Block */}
          <div className="code-block max-w-md">
            <div className="code-block-header">
              <div className="code-block-dots">
                <span className="code-block-dot red" />
                <span className="code-block-dot yellow" />
                <span className="code-block-dot green" />
              </div>
              <span className="code-block-title">welcome.ts</span>
            </div>
            <div className="code-block-content">
              <div>
                <span className="code-keyword">const</span>{" "}
                <span className="code-variable">createProfile</span> ={" "}
                <span className="code-keyword">async</span> () =&gt; {"{"}
              </div>
              <div className="ml-4">
                <span className="code-keyword">return</span> {"{"}
              </div>
              <div className="ml-8">
                <span className="code-function">status</span>:{" "}
                <span className="code-string">&quot;success&quot;</span>,
              </div>
              <div className="ml-8">
                <span className="code-function">message</span>:{" "}
                <span className="code-string">&quot;Profile created!&quot;</span>
              </div>
              <div className="ml-4">{"}"}</div>
              <div>{"}"}</div>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { text: "Beautiful developer profiles", done: true },
              { text: "Export to PDF & share", done: true },
              { text: "Real-time analytics", done: true },
              { text: "GitHub integration", done: true },
            ].map((feature, i) => (
              <div key={i} className="text-pf-fg-muted flex items-center gap-3 font-mono text-sm">
                <div className="text-pf-success-fg flex h-5 w-5 items-center justify-center">
                  <Check className="h-4 w-4" strokeWidth={2} />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-pf-fg-subtle font-mono text-xs">
          © {new Date().getFullYear()} ProFile. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-pf-border-muted border-b p-4 lg:border-b-0">
          <div className="flex items-center justify-between">
            <LocalizedLink href={ROUTES.HOME} className="flex items-center gap-2">
              <ArrowLeft className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
              <span className="text-pf-fg-muted font-mono text-xs">back</span>
            </LocalizedLink>
            <LocalizedLink href={ROUTES.HOME} className="flex items-center gap-2 lg:hidden">
              <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex h-7 w-7 items-center justify-center">
                <Terminal className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <span className="text-pf-fg-default font-mono text-sm font-semibold">profile</span>
            </LocalizedLink>
            <div className="w-16 lg:hidden" />
          </div>
        </header>

        {/* Form Content */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2">
                <span className="text-pf-attention-fg font-mono text-xs">●</span>
                <span className="text-pf-fg-muted font-mono text-xs">new_user: true</span>
              </div>
              <h2 className="text-pf-fg-default mt-4 text-2xl font-bold">Create your account</h2>
              <p className="text-pf-fg-muted mt-2 font-mono text-xs">
                Already have an account?{" "}
                <LocalizedLink
                  href={ROUTES.AUTH.SIGN_IN}
                  className="text-pf-fg-default font-semibold hover:underline"
                >
                  Sign in
                </LocalizedLink>
              </p>
            </div>

            {/* GitHub OAuth */}
            <button className="border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default hover:bg-pf-canvas-inset mb-6 flex w-full items-center justify-center gap-3 border py-3 font-mono text-sm transition-colors">
              <Github className="h-4 w-4" strokeWidth={1.5} />
              Sign up with GitHub
            </button>

            {/* Divider */}
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-pf-border-default h-px flex-1" />
              <span className="text-pf-fg-subtle font-mono text-xs">or continue with email</span>
              <div className="bg-pf-border-default h-px flex-1" />
            </div>

            {/* Sign Up Form */}
            <SignUpForm />

            {/* Terms */}
            <p className="text-pf-fg-subtle mt-6 text-center font-mono text-xs">
              By signing up, you agree to our{" "}
              <LocalizedLink href="/terms" className="hover:text-pf-fg-default underline">
                Terms
              </LocalizedLink>{" "}
              and{" "}
              <LocalizedLink href="/privacy" className="hover:text-pf-fg-default underline">
                Privacy Policy
              </LocalizedLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
