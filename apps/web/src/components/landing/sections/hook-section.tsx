'use client';

/**
 * Hook section - bridges hero to problem
 * White bg, black text
 */
export function HookSection() {
  return (
    <section className="relative bg-white px-6 py-24">
      {/* Gradient line top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      <div className="mx-auto max-w-4xl text-center">
        <p className="text-lg text-zinc-400 md:text-xl">Você manda currículo. Espera. E nada.</p>
        <h2 className="mt-4 text-3xl font-black text-zinc-900 md:text-5xl uppercase">
          O problema não é{' '}
          <span className="relative inline-block">
            <span className="relative z-10">você</span>
            <span
              className="absolute inset-x-0 bottom-0.5 -z-0 h-2 bg-cyan-200 md:h-3"
              aria-hidden="true"
            />
          </span>
          .
        </h2>
        <p className="mt-4 text-lg text-zinc-500 md:text-xl">É o sistema. E ele está quebrado.</p>
      </div>

      {/* Gradient line bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
    </section>
  );
}
