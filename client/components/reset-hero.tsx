import { LockKeyhole, MessageSquareText } from "lucide-react";

export function ResetHero() {
  return (
    <div className="flex flex-col justify-center">
      <p className="text-sm font-bold uppercase tracking-wide text-il-orange">
        Password Recovery
      </p>
      <h1 className="mt-3 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
        Reset your
        <br />
        account access.
      </h1>
      <p className="mt-4 max-w-md text-gray-500">
        Enter your email to receive a secure verification code and get back into your account quickly.
      </p>

      <div className="mt-10 flex items-center gap-6 text-gray-700">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-il-navy text-white shadow-md">
          <LockKeyhole className="h-8 w-8 text-il-orange" />
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-il-orange shadow-md">
          <MessageSquareText className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
