"use client";

interface CtaGenericSectionProps {
	title: string;
	titleAccent: string;
}

export function CtaGenericSection({
	title,
	titleAccent,
}: CtaGenericSectionProps) {
	return (
		<section className="relative z-10 bg-white px-4 py-32">
			<div className="mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

			<div className="mx-auto max-w-4xl py-32 text-center">
				<h2 className="mb-8 text-6xl font-black uppercase leading-none tracking-tighter text-black md:text-[9rem]">
					{title}
					<br />
					<span className="decoration-cyan-500 underline decoration-4 underline-offset-8">
						{titleAccent}
					</span>
				</h2>
			</div>

			<div className="mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
		</section>
	);
}
