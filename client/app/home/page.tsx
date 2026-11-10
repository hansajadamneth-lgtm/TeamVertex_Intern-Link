import { HomeNavbar } from "@/components/home-navbar";
import { JobSearchHero } from "@/components/job-search-hero";
import { RecommendedJobs } from "@/components/recommended-jobs";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return <main className="flex min-h-screen flex-col bg-[#f6f8fc]"><HomeNavbar /><JobSearchHero /><RecommendedJobs /><Footer /></main>;
}
