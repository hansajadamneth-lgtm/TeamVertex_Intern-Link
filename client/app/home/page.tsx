import { HomeNavbar } from "@/components/home-navbar";
import { JobSearchHero } from "@/components/job-search-hero";
import { DashboardActions } from "@/components/dashboard-actions";
import { RecommendedJobs } from "@/components/recommended-jobs";
import { ProjectNavigation } from "@/components/project-navigation";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <HomeNavbar />
      <JobSearchHero />
      <DashboardActions />
      <RecommendedJobs />
      <ProjectNavigation />
      <Footer />
    </main>
  );
}
