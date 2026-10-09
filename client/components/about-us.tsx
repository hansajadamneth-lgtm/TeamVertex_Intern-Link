import Image from "next/image";

export function AboutHero() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-il-orange">
          About us
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Empowering Students.
          <br />
          <span className="text-il-orange">Building Futures.</span>
        </h1>
        <p className="mt-4 text-sm font-semibold text-gray-700 sm:text-base">
          Powered by AI. Built for Students, Employers &amp; Recruiters.
        </p>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-500 sm:text-base">
          InternLink is an AI-Powered internship and recruitment platform
          that connects students with the right opportunities and helps
          companies find the best emerging talent. We combine smart
          technology with real opportunities to help students learn, grow
          and launch successful careers.
        </p>
      </div>

      <div className="relative mx-auto aspect-4/3 w-full max-w-lg">
        <Image
          src="/about-illustration.png"
          alt="Students and recruiters working together"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
