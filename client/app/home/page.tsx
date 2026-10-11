import { HomeNavbar } from "@/components/home-navbar";
import { ProjectPageBar } from "@/components/project-page-bar";
import { JobSearchHero } from "@/components/job-search-hero";
import { RecommendedJobs } from "@/components/recommended-jobs";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <HomeNavbar />
      <ProjectPageBar />
      <JobSearchHero />
      <RecommendedJobs />
      <Footer />
    </main>
  );
}
