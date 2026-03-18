/**
 * Complete Step
 *
 * Nielsen: Visibility of system status (success feedback)
 */

'use client';

import { getAuthSessionQueryKey, useAuthSession } from '@profile/api-client';
import { useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ROUTES } from '@/config/routes';
import { useOnboarding } from '../hooks';

export function CompleteStep() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useAuthSession();
  const user = data?.data?.user;
  const { personalInfo } = useOnboarding();
  const [showContent, setShowContent] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Refresh session data from backend
  const refreshSession = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: getAuthSessionQueryKey(),
    });
  }, [queryClient]);

  useEffect(() => {
    // Trigger confetti 🎉
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#2563eb', '#16a34a', '#9333ea'];

    (function frame() {
      void confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      void confetti({
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
    let countdownInterval: ReturnType<typeof setInterval> | null = null;
    let isRedirecting = false;

    // Refresh session to reflect completed onboarding
    const updateAuthState = async () => {
      if (user && !user.hasCompletedOnboarding) {
        // Refresh from backend to ensure sync
        await refreshSession();
      }
    };

    if (user && !user.hasCompletedOnboarding) {
      void updateAuthState();
    }

    // Countdown and auto-redirect
    countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1 && !isRedirecting) {
          isRedirecting = true;
          if (countdownInterval) {
            clearInterval(countdownInterval);
          }
          router.push(ROUTES.PROTECTED.RESUME);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [user, refreshSession, router]);

  const handleGoToDashboard = () => {
    // No action needed - React Query handles state
  };

  return (
    <div className="space-y-8 py-8 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
          <Sparkles
            className="absolute -top-1 -right-1 h-6 w-6 animate-pulse text-emerald-500"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Success Message */}
      <div
        className={`transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <h2 className="text-2xl font-bold text-white">
          Welcome, {personalInfo?.fullName?.split(' ')[0]}! 🎉
        </h2>
        <p className="mt-2 font-mono text-sm text-zinc-400">
          Your professional profile has been created successfully
        </p>
        {countdown > 0 && (
          <p className="mt-2 font-mono text-xs text-cyan-400">
            Redirecting to your resume in {countdown} second
            {countdown !== 1 ? 's' : ''}...
          </p>
        )}
      </div>

      {/* Code Block Celebration */}
      <div
        className={`rounded-lg border border-white/10 bg-[#0A0A0A] p-4 text-left font-mono text-sm transition-all delay-300 duration-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <div className="mb-2 text-xs text-zinc-500">
          <span className="opacity-60">{'//'}</span> profile.created.ts
        </div>
        <div className="space-y-1">
          <div>
            <span className="text-purple-400">const</span>
            <span className="text-blue-300"> profile</span>
            <span className="text-zinc-300"> = {`{`}</span>
          </div>
          <div className="pl-4">
            <span className="text-blue-300">status</span>
            <span className="text-zinc-300">: </span>
            <span className="text-green-400">&quot;active&quot;</span>
            <span className="text-zinc-300">,</span>
          </div>
          <div className="pl-4">
            <span className="text-blue-300">completeness</span>
            <span className="text-zinc-300">: </span>
            <span className="text-orange-400">100</span>
            <span className="text-zinc-300">,</span>
          </div>
          <div className="pl-4">
            <span className="text-blue-300">ready</span>
            <span className="text-zinc-300">: </span>
            <span className="text-purple-400">true</span>
            <span className="text-zinc-300">,</span>
          </div>
          <div>
            <span className="text-zinc-300">{`}`};</span>
          </div>
          <div className="mt-2">
            <span className="text-yellow-300">console</span>
            <span className="text-zinc-300">.</span>
            <span className="text-yellow-300">log</span>
            <span className="text-zinc-300">(</span>
            <span className="text-green-400">&quot;✨ Profile ready!&quot;</span>
            <span className="text-zinc-300">);</span>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div
        className={`border border-white/10 p-4 text-left transition-all delay-500 duration-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <h3 className="font-mono text-sm font-semibold text-white">What&apos;s next?</h3>
        <ul className="mt-3 space-y-2 font-mono text-xs text-zinc-400">
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
        className={`flex flex-col gap-3 transition-all delay-700 duration-700 sm:flex-row sm:justify-center ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <Link
          href={ROUTES.PROTECTED.RESUME}
          onClick={handleGoToDashboard}
          className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3 font-mono text-sm text-black transition-opacity hover:opacity-90"
        >
          View My Resume
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>

        <Link
          href={ROUTES.PROTECTED.PROFILE}
          onClick={handleGoToDashboard}
          className="inline-flex items-center justify-center gap-2 border border-white/10 px-6 py-3 font-mono text-sm text-white transition-colors hover:bg-white/5"
        >
          Go to Dashboard
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>

      {/* Footer */}
      <p className="font-mono text-xs text-zinc-500">
        Need help? Check our{' '}
        <Link href="#" className="text-cyan-400 hover:underline">
          documentation
        </Link>{' '}
        or{' '}
        <Link href="#" className="text-cyan-400 hover:underline">
          contact support
        </Link>
      </p>
    </div>
  );
}
