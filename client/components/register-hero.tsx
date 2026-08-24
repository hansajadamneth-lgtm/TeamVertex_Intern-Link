import Image from "next/image";

export function RegisterHero() {
  return (
    <div className="flex flex-col justify-center max-w-lg">
      <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
        Welcome to
        <br />
        <span>
          Intern<span className="text-il-orange">Link</span>
        </span>
      </h1>

      {/* Decorative underline bar */}
      <div className="mt-3 flex items-center gap-1">
        <div className="h-1 w-69 rounded-full bg-gray-800" />
      </div>

      <p className="mt-6 text-sm leading-relaxed text-gray-500 max-w-md">
        Create your account to explore personalized internships, create your CV &amp; cover letters, connect with leading companies, and take the next step toward your career journey.
      </p>

      {/* Illustration */}
      <div className="relative mt-8 w-full max-w-md">
        <Image
          src="/workimage.png"
          alt="InternLink Career Illustration"
          width={450}
          height={380}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}
