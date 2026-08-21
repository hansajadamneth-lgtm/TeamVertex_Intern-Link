interface StepNumberProps {
  step: number;
}

export function StepNumber({ step }: StepNumberProps) {
  return (
    <span className="mb-1 flex h-5 w-5 items-center justify-center rounded bg-gray-900 text-[11px] font-bold text-white">
      {step}
    </span>
  );
}
