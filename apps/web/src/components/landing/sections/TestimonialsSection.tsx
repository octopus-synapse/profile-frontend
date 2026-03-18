'use client';

/**
 * TestimonialsSection - Rotating Developer Success Stories
 *
 * Features:
 * - Auto-rotating testimonial cards
 * - Developer-focused success stories
 * - Gradient borders and glow effects
 * - Company logos and roles
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  highlight?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    avatar: 'AC',
    content:
      'PATCH completely transformed my job search. My resume went from generic to perfectly tailored for each role. Landed 3x more interviews in the first week.',
    rating: 5,
    highlight: '3x more interviews',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    role: 'Full Stack Developer',
    company: 'Stripe',
    avatar: 'SM',
    content:
      'The ATS optimization is incredible. I was getting filtered out by automated systems before. Now my applications actually reach recruiters.',
    rating: 5,
    highlight: 'ATS bypass success',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    role: 'DevOps Engineer',
    company: 'Netflix',
    avatar: 'MJ',
    content:
      'Built my resume in 10 minutes. The AI suggestions for my skills section were spot-on. Got an offer from my dream company within a month.',
    rating: 5,
    highlight: 'Dream job in 1 month',
  },
  {
    id: '4',
    name: 'Emily Zhang',
    role: 'Backend Engineer',
    company: 'Meta',
    avatar: 'EZ',
    content:
      'As someone who hates writing about myself, PATCH made it painless. The templates are beautiful and the export quality is professional.',
    rating: 5,
    highlight: 'Painless experience',
  },
  {
    id: '5',
    name: 'David Park',
    role: 'Tech Lead',
    company: 'Microsoft',
    avatar: 'DP',
    content:
      "I recommend PATCH to everyone on my team. It's become our go-to tool for resume updates. The version control feature is genius.",
    rating: 5,
    highlight: 'Team-wide adoption',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  isActive,
}: {
  testimonial: Testimonial;
  isActive: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isActive ? 1 : 0.4,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 ${
        isActive ? 'border-zinc-700 shadow-xl' : 'border-zinc-800'
      }`}
      aria-label={`Testimonial from ${testimonial.name}`}
    >
      {/* Gradient glow for active card */}
      {isActive && (
        <div
          className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-b from-blue-500/20 via-blue-400/10 to-transparent blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Quote Icon */}
      <Quote className="mb-4 h-8 w-8 text-blue-500/50" aria-hidden="true" />

      {/* Content */}
      <blockquote className="mb-6 text-sm leading-relaxed text-zinc-300">
        {testimonial.content}
      </blockquote>

      {/* Highlight Badge */}
      {testimonial.highlight && isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          {testimonial.highlight}
        </motion.div>
      )}

      {/* Author */}
      <footer className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-blue-400/30 text-sm font-semibold text-white">
          {testimonial.avatar}
        </div>
        <div className="flex-1">
          <cite className="not-italic font-medium text-zinc-200">{testimonial.name}</cite>
          <div className="text-xs text-zinc-500">
            {testimonial.role} @ {testimonial.company}
          </div>
        </div>
        <StarRating rating={testimonial.rating} />
      </footer>
    </motion.article>
  );
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const getVisibleTestimonials = () => {
    const indices = [];
    for (let i = -1; i <= 1; i++) {
      const idx = (activeIndex + i + TESTIMONIALS.length) % TESTIMONIALS.length;
      indices.push(idx);
    }
    return indices;
  };

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Trusted by developers
          </div>
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Developers love PATCH
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            Join thousands of engineers who've transformed their job search
          </p>
        </motion.div>

        {/* Testimonials Grid - Desktop */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-3" role="list">
          {getVisibleTestimonials().map((idx, position) => (
            <TestimonialCard
              key={TESTIMONIALS[idx].id}
              testimonial={TESTIMONIALS[idx]}
              isActive={position === 1}
            />
          ))}
        </div>

        {/* Testimonials - Mobile */}
        <div className="lg:hidden" role="list">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <TestimonialCard testimonial={TESTIMONIALS[activeIndex]} isActive={true} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots - Nielsen #3: User control */}
        <nav className="mt-8 flex justify-center gap-2" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                idx === activeIndex ? 'w-8 bg-blue-500' : 'w-2 bg-zinc-700 hover:bg-zinc-600'
              }`}
              aria-label={`View testimonial from ${t.name}`}
              aria-current={idx === activeIndex ? 'true' : undefined}
            />
          ))}
        </nav>

        {/* Stats Row - Nielsen #6: Recognition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8"
          role="list"
          aria-label="Key statistics"
        >
          {[
            { value: '10,000+', label: 'Developers' },
            { value: '94%', label: 'ATS Pass Rate' },
            { value: '3.2x', label: 'More Interviews' },
            { value: '4.9/5', label: 'User Rating' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-center backdrop-blur-sm sm:p-6"
            >
              <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs text-zinc-500 sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
