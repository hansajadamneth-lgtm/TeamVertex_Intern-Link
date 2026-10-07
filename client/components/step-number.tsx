type StepNumberProps = {
  step: number;
};

export function StepNumber({ step }: StepNumberProps) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-il-orange text-xs font-bold text-white">
      {step}
    </span>
  );
}
