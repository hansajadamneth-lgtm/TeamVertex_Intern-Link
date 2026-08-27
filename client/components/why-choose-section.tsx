import { Search, UserRound, Sparkles, FileText, Send, Star } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";

const FEATURES = [
  {
    icon: Search,
    iconClassName: "bg-orange-100 text-il-orange",
    title: "Find Internships",
    description:
      "Discover thousands of internship opportunities that match your skills, interests, and career goals.",
  },
  {
    icon: UserRound,
    iconClassName: "bg-indigo-100 text-indigo-500",
    title: "Build Your Profile",
    description:
      "Create a professional profile that highlights your skills, education, achievements, and experience.",
  },
  {
    icon: Sparkles,
    iconClassName: "bg-pink-100 text-pink-500",
    title: "AI-Powered Tools",
    description:
      "Our AI analyzes your profile and helps you find the best internship opportunities faster and smarter.",
  },
  {
    icon: FileText,
    iconClassName: "bg-emerald-100 text-emerald-500",
    title: "Create CV",
    description:
      "Build a professional, ATS-friendly CV in minutes using our easy-to-use smart CV builder.",
  },
  {
    icon: Send,
    iconClassName: "bg-amber-100 text-amber-500",
    title: "AI Cover Letters",
    description:
      "Generate personalized cover letters for every application with the power of AI.",
  },
];

export function WhyChooseSection() {
  return (
    <div className="mt-20">
      <div className="flex items-center justify-center gap-4">
        <span className="h-px w-16 bg-il-orange/40" />
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Why Choose <span className="text-il-orange">InternLink</span>?
        </h2>
        <span className="h-px w-16 bg-il-orange/40" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(11,27,62,0.15)] sm:items-center">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
          <Star className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-bold text-il-navy">Recommendations</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Get AI-based internship recommendations tailored to your
            skills, goals, interests, and preferences.
          </p>
        </div>
      </div>
    </div>
  );
}