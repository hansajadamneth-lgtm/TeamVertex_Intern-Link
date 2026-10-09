import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  iconClassName,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="flex h-full flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-[0_10px_30px_-15px_rgba(11,27,62,0.15)] transition-transform hover:-translate-y-1">
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          iconClassName
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-bold text-il-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}
