import { GraduationCap, MessageCircle, Users } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
        Find Your Dream
        <br />
        Internship.
        <br />
        <span className="text-il-orange">Build Your Future.</span>
      </h1>
      <div className="mt-4 h-1.5 w-16 rounded bg-il-orange" />
      <p className="mt-6 max-w-md text-gray-500">
        Sign in to your account and discover amazing internship &amp; job
        opportunities tailored for you.
      </p>

      {/* Illustration */}
      <div className="relative mt-12 hidden max-w-md items-end justify-center gap-6 sm:flex">
        <div className="flex h-56 w-40 flex-col items-center justify-center rounded-xl bg-il-navy text-white shadow-lg">
          <GraduationCap className="mb-3 h-10 w-10 text-il-orange" />
          <div className="space-y-2 px-4">
            <div className="h-2 w-24 rounded bg-il-orange/80" />
            <div className="h-2 w-20 rounded bg-white/30" />
            <div className="h-2 w-24 rounded bg-white/30" />
            <div className="h-2 w-16 rounded bg-white/30" />
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center gap-3">
          <Users className="h-12 w-12 text-il-navy" />
          <MessageCircle className="h-8 w-8 text-il-orange" />
        </div>
      </div>
    </div>
  );
}
