/**
 * Complete Step
 *
 * Nielsen: Visibility of system status (success feedback)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOnboardingStore } from "../../stores";
import { CheckCircle2, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import confetti from "canvas-confetti";

export function CompleteStep() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { personalInfo, reset } = useOnboardingStore();
  const [showContent, setShowContent] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Trigger confetti 🎉
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ["#2563eb", "#16a34a", "#9333ea"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Show content after animation
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Update session and redirect automatically
  useEffect(() => {
    // Update session to reflect completed onboarding
    const updateSessionData = async () => {
      try {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            hasCompletedOnboarding: true,
          },
        });
      } catch (error) {
        console.error("Failed to update session:", error);
      }
    };

    if (session) {
      updateSessionData();
    }

    // Countdown and auto-redirect
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          reset();
          router.push(ROUTES.PROTECTED.RESUME);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [session, updateSession, router, reset]);

  const handleGoToDashboard = () => {
    reset(); // Clear onboarding state
  };

  return (
    <div className="space-y-8 py-8 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="bg-emerald-500/10 relative flex h-20 w-20 items-center justify-center rounded-full">
          <CheckCircle2 className="text-emerald-500 h-10 w-10" strokeWidth={1.5} />
          <Sparkles
            className="text-emerald-500 absolute -top-1 -right-1 h-6 w-6 animate-pulse"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Success Message */}
      <div
        className={`transition-all duration-500 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <h2 className="text-white text-2xl font-bold">
          Welcome, {personalInfo?.fullName?.split(" ")[0]}! 🎉
        </h2>
        <p className="text-zinc-400 mt-2 font-mono text-sm">
          Your professional profile has been created successfully
        </p>
        {countdown > 0 && (
          <p className="text-cyan-400 mt-2 font-mono text-xs">
            Redirecting to your resume in {countdown} second{countdown !== 1 ? "s" : ""}...
          </p>
        )}
      </div>

      {/* Code Block Celebration */}
      <div
        className={`bg-white rounded-lg p-4 text-left font-mono text-sm transition-all delay-300 duration-700 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className="mb-2 text-xs text-gray-500">
          <span className="opacity-60">{"//"}</span> profile.created.ts
        </div>
        <div className="space-y-1">
          <div>
            <span className="text-purple-400">const</span>
            <span className="text-blue-300"> profile</span>
            <span className="text-white"> = {`{`}</span>
          </div>
          <div className="pl-4">
            <span className="text-blue-300">status</span>
            <span className="text-white">: </span>
            <span className="text-green-400">&quot;active&quot;</span>
            <span className="text-white">,</span>
          </div>
          <div className="pl-4">
            <span className="text-blue-300">completeness</span>
            <span className="text-white">: </span>
            <span className="text-orange-400">100</span>
            <span className="text-white">,</span>
          </div>
          <div className="pl-4">
            <span className="text-blue-300">ready</span>
            <span className="text-white">: </span>
            <span className="text-purple-400">true</span>
            <span className="text-white">,</span>
          </div>
          <div>
            <span className="text-white">{`}`};</span>
          </div>
          <div className="mt-2">
            <span className="text-yellow-300">console</span>
            <span className="text-white">.</span>
            <span className="text-yellow-300">log</span>
            <span className="text-white">(</span>
            <span className="text-green-400">&quot;✨ Profile ready!&quot;</span>
            <span className="text-white">);</span>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div
        className={`border-white/10 border p-4 text-left transition-all delay-500 duration-700 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <h3 className="text-white font-mono text-sm font-semibold">What&apos;s next?</h3>
        <ul className="text-zinc-400 mt-3 space-y-2 font-mono text-xs">
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">→</span>
            View and customize your resume
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">→</span>
            Export to PDF or DOCX
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">→</span>
            Share your public profile link
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">→</span>
            Add more details anytime in settings
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div
        className={`flex flex-col gap-3 transition-all delay-700 duration-700 sm:flex-row sm:justify-center ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <Link
          href={ROUTES.PROTECTED.RESUME}
          onClick={handleGoToDashboard}
          className="bg-white text-black inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm transition-opacity hover:opacity-90"
        >
          View My Resume
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>

        <Link
          href={ROUTES.PROTECTED.PROFILE}
          onClick={handleGoToDashboard}
          className="border-white/10 text-white hover:bg-white/5 inline-flex items-center justify-center gap-2 border px-6 py-3 font-mono text-sm transition-colors"
        >
          Go to Dashboard
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>

      {/* Footer */}
      <p className="text-zinc-500 font-mono text-xs">
        Need help? Check our{" "}
        <Link href="#" className="text-cyan-400 hover:underline">
          documentation
        </Link>{" "}
        or{" "}
        <Link href="#" className="text-cyan-400 hover:underline">
          contact support
        </Link>
      </p>
    </div>
  );
}
