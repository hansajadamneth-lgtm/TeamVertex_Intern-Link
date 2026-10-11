import Link from "next/link";
import { Bell, CheckCircle2, FileText, MessageCircle } from "lucide-react";

const notifications = [
  { title: "Two applications were shortlisted", detail: "Your applications for Frontend Engineer and UI/UX Design Intern moved to review.", time: "2 hours ago", icon: CheckCircle2, color: "text-green-500" },
  { title: "New job matching your profile", detail: "A Cloud Solutions Intern role at LSEG matches 72% of your skills.", time: "Yesterday", icon: Bell, color: "text-blue-500" },
  { title: "Application successfully submitted", detail: "Your application for Data Analyst Intern was sent to Solvex.", time: "2 days ago", icon: FileText, color: "text-[#ff7417]" },
  { title: "Complete your profile", detail: "Add your latest skills to improve recommendation accuracy.", time: "3 days ago", icon: MessageCircle, color: "text-purple-500" },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fa] text-[#17233b]">
      <Header />
      <section className="mx-auto max-w-[900px] px-5 pb-20 pt-10 sm:px-10">
        <div className="flex items-end justify-between">
          <div><h1 className="text-2xl font-semibold">Updates &amp; Alerts</h1><p className="mt-1 text-[11px] text-[#7b8799]">Stay up to date with your applications and job recommendations.</p></div>
          <button type="button" className="text-[10px] font-semibold text-[#356be8]">Mark all as read</button>
        </div>
        <div className="mt-8 space-y-3">
          {notifications.map(({ title, detail, time, icon: Icon, color }) => (
            <article key={title} className="flex gap-4 rounded-lg border border-[#dce3eb] bg-white p-5 shadow-sm">
              <Icon className={`mt-1 h-5 w-5 shrink-0 ${color}`} />
              <div className="flex-1"><div className="flex justify-between gap-3"><h2 className="text-sm font-semibold">{title}</h2><time className="text-[9px] text-[#98a2b3]">{time}</time></div><p className="mt-1 text-[11px] text-[#667085]">{detail}</p></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Header() {
  return <header className="bg-[#0b142b] px-4 py-3 sm:px-8"><nav className="mx-auto flex max-w-[1120px] items-center justify-between"><Link href="/home" className="flex h-10 w-10 items-center justify-center overflow-hidden bg-white"><img src="/internlink-logo.png" alt="InternLink" className="h-full w-full object-contain" /></Link><div className="hidden items-center gap-2 text-[9px] text-white sm:flex"><Link href="/cover-letter" className="rounded-md px-3 py-2 text-slate-300 hover:bg-white/10">AI Cover Letter</Link><Link href="/recommendations" className="rounded-md px-3 py-2 text-slate-300 hover:bg-white/10">Recommendations</Link><Link href="/applications" className="rounded-md px-3 py-2 text-slate-300 hover:bg-white/10">Applications</Link><Link href="/notifications" className="rounded-md bg-[#ff7417] px-3 py-2 font-semibold">Notifications</Link></div><Link href="/login" className="rounded-full bg-[#ff7417] px-5 py-2 text-[8px] font-semibold uppercase text-white">Sign out</Link></nav></header>;
}
