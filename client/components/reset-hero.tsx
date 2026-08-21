import Image from "next/image";

export function ResetHero() {
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
        Reset Your <span className="text-il-orange">Password,</span>
        <br />
        Secure Your Future.
      </h1>
      <div className="mt-4 h-1.5 w-16 rounded bg-gray-900" />
      <p className="mt-6 max-w-md text-gray-500">
        Don&apos;t worry! Enter your registered email address and we&apos;ll
        send you a verification code to reset your password.
      </p>

      <div className="mt-10 flex justify-center sm:justify-start">
        <Image
          src="/forgot-password-illustration.png"
          alt="Reset your password illustration"
          width={420}
          height={420}
          className="mt-10 w-full max-w-sm object-contain mx-auto sm:mx-0"
        />
      </div>
    </div>
  );
}
