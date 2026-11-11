import { redirect } from "next/navigation";

export default function LandingPage() {
  // The legacy resume-upload UI only changed browser state and falsely
  // claimed files had been analyzed. Open the working live InternLink home.
  redirect("/home");
}
