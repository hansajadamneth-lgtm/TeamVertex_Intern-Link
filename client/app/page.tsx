"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

type ResumeStatus = "Analyzed" | "Processing";

type Resume = {
  name: string;
  status: ResumeStatus;
};

const tabs = ["upload", "Resume Details", "Resume Score", "Skill Gap"];

const initialResumes: Resume[] = [
  { name: "Hansaja Damneth_CV.pdf", status: "Analyzed" },
  { name: "Hansaja Damneth V2_CV.pdf", status: "Processing" },
];

export default function ResumeManagementPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [resumes, setResumes] = useState(initialResumes);

  const addFiles = (files: FileList | File[]) => {
    const acceptedFiles = Array.from(files).filter((file) =>
      /\.(pdf|docx)$/i.test(file.name),
    );

    if (acceptedFiles.length === 0) return;

    setResumes((current) => [
      ...current,
      ...acceptedFiles.map((file) => ({
        name: file.name,
        status: "Processing" as const,
      })),
    ]);
  };

  const renderUploadContent = () => (
    <>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={`flex min-h-[136px] flex-col items-center justify-center rounded-[70px] border-2 px-4 text-center shadow-[0_2px_2px_rgba(0,0,0,0.22)] transition-colors ${
          isDragging ? "border-[#ff7417] bg-orange-50" : "border-[#d0d0d0]"
        }`}
      >
        <svg aria-hidden="true" className="mb-1 h-5 w-5 text-[#536072]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 16V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 14v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3" strokeLinecap="round" />
        </svg>
        <p className="text-[16px] text-[#273246]">Drag and drop your resume</p>
        <p className="text-[10px] text-[#667084]">PDF or DOCX, up to 5 MB</p>
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 rounded-[10px] bg-[#d9d9d9] px-7 py-2 text-[12px] text-[#273246] transition-colors hover:bg-[#c8c8c8]">
          Browse Files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      <div className="mt-10 px-3 sm:px-8">
        <h2 className="text-[14px] font-normal">Uploaded resumes</h2>
        <ul className="mt-5 space-y-3">
          {resumes.map((resume) => (
            <li key={`${resume.name}-${resume.status}`} className="flex items-center justify-between gap-3 text-[12px]">
              <span className="flex min-w-0 items-center gap-2">
                <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#4d4d4d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M6 3h8l4 4v14H6z" strokeLinejoin="round" />
                  <path d="M14 3v5h4M9 13h6m-6 3h6" strokeLinecap="round" />
                </svg>
                <span className="truncate">{resume.name}</span>
              </span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${resume.status === "Analyzed" ? "bg-[#e8f9ed] text-[#36b768]" : "bg-[#fff7d9] text-[#e6b700]"}`}>
                {resume.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const renderDetailsContent = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
        <div>
          <p className="text-[18px] font-semibold text-[#0b142b]">Hansaja Damneth</p>
          <p className="mt-1 text-[11px] text-[#667084]">Frontend Developer · Colombo, Sri Lanka</p>
        </div>
        <span className="rounded-full bg-[#e8f9ed] px-3 py-1 text-[10px] text-[#36a866]">Resume analyzed</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Email", "hansaja.damneth@email.com"],
          ["Phone", "+94 77 123 4567"],
          ["Education", "BSc in Information Technology"],
          ["Experience", "2 years"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[#f7f8fa] px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-[#7d8490]">{label}</p>
            <p className="mt-1 text-[12px] text-[#273246]">{value}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-[13px] font-semibold text-[#0b142b]">Professional summary</h2>
        <p className="mt-2 rounded-lg bg-[#f7f8fa] p-4 text-[11px] leading-5 text-[#4b5565]">
          Motivated frontend developer with experience building responsive web applications and a strong interest in user-focused product development.
        </p>
      </div>
      <div>
        <h2 className="text-[13px] font-semibold text-[#0b142b]">Detected skills</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {["React", "JavaScript", "TypeScript", "Next.js", "HTML", "CSS", "Git"].map((skill) => (
            <span key={skill} className="rounded-full border border-[#dce1e8] px-3 py-1 text-[10px] text-[#334155]">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScoreContent = () => {
    const categories = [["Skills", 88], ["Experience", 76], ["Formatting", 92], ["Keywords", 81]];
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-5 border-b border-[#e5e5e5] pb-6 sm:flex-row">
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-[10px] border-[#ff7417]">
            <span className="text-3xl font-semibold text-[#0b142b]">84</span>
            <span className="text-[10px] text-[#667084]">out of 100</span>
          </div>
          <div>
            <h2 className="text-[17px] font-semibold text-[#0b142b]">Your resume is strong</h2>
            <p className="mt-2 max-w-md text-[11px] leading-5 text-[#667084]">You have a solid foundation for frontend internships. Improve your project impact and add a few in-demand tools to stand out.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map(([label, score]) => (
            <div key={label} className="rounded-lg bg-[#f7f8fa] p-4">
              <div className="flex justify-between text-[11px]"><span>{label}</span><span className="font-semibold text-[#0b142b]">{score}%</span></div>
              <div className="mt-2 h-2 rounded-full bg-[#e1e5eb]"><div className="h-2 rounded-full bg-[#ff7417]" style={{ width: `${score}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-[#ffe0c9] bg-[#fff8f2] p-4 text-[11px] text-[#67452d]">
          <span className="font-semibold">Quick win:</span> Add measurable results to your project descriptions, such as load-time improvements or users reached.
        </div>
      </div>
    );
  };

  const renderSkillGapContent = () => {
    const gaps = [
      ["Testing", "Jest and React Testing Library", 25, "High priority"],
      ["Backend basics", "REST APIs and Node.js", 45, "Recommended"],
      ["Cloud deployment", "Azure or Vercel deployment", 15, "Recommended"],
    ];
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
          <div><h2 className="text-[18px] font-semibold text-[#0b142b]">Skills to strengthen</h2><p className="mt-1 text-[11px] text-[#667084]">Based on your target frontend developer roles</p></div>
          <span className="rounded-full bg-[#fff7d9] px-3 py-1 text-[10px] text-[#b58a00]">3 gaps found</span>
        </div>
        {gaps.map(([title, description, progress, priority]) => (
          <div key={title} className="rounded-lg border border-[#e6e9ee] p-4">
            <div className="flex items-start justify-between gap-3"><div><h3 className="text-[13px] font-semibold text-[#273246]">{title}</h3><p className="mt-1 text-[11px] text-[#667084]">{description}</p></div><span className={`rounded-full px-2 py-1 text-[9px] ${priority === "High priority" ? "bg-[#fff0ed] text-[#dc5b45]" : "bg-[#eef4ff] text-[#4775bd]"}`}>{priority}</span></div>
            <div className="mt-3 flex items-center gap-3"><div className="h-2 flex-1 rounded-full bg-[#e1e5eb]"><div className="h-2 rounded-full bg-[#0b142b]" style={{ width: `${progress}%` }} /></div><span className="text-[10px] text-[#667084]">{progress}% ready</span></div>
          </div>
        ))}
        <button type="button" className="w-full rounded-lg bg-[#0b142b] py-3 text-[11px] text-white transition-colors hover:bg-[#182647]">View personalized learning path</button>
      </div>
    );
  };

  const renderActiveContent = () => {
    if (activeTab === "Resume Details") return renderDetailsContent();
    if (activeTab === "Resume Score") return renderScoreContent();
    if (activeTab === "Skill Gap") return renderSkillGapContent();
    return renderUploadContent();
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f4f4] text-[#101010]">
      <div className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col bg-white shadow-sm">
        <header>
          <h1 className="px-4 pb-2 pt-1 text-[16px] font-normal text-[#9a9a9a]">
            Resume Management
          </h1>

          <nav className="mx-0 flex min-h-[72px] items-center rounded-b-[9px] bg-[#0b142b] px-6 sm:px-10">
            <Link href="/" aria-label="InternLink home" className="shrink-0">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image
                  src="/internlink-logo.png"
                  alt="InternLink"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </span>
            </Link>

            <div className="ml-auto flex items-center gap-5 text-[10px] text-white sm:gap-10 sm:text-[11px]">
              <a href="#find-jobs" className="transition-opacity hover:opacity-70">
                Find jobs
              </a>
              <a href="#cv-builder" className="transition-opacity hover:opacity-70">
                CV builder
              </a>
              <a href="#recommendation" className="transition-opacity hover:opacity-70">
                Recommendation
              </a>
              <a href="#saved" className="transition-opacity hover:opacity-70">
                Saved
              </a>
              <button
                type="button"
                className="rounded-full bg-[#ff7417] px-5 py-2 text-[8px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#e9650b]"
              >
                Sign out
              </button>
            </div>
          </nav>
        </header>

        <section className="flex flex-1 flex-col items-center px-4 pb-20 pt-8 sm:px-10">
          <div className="mb-7 flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-1 text-[10px] capitalize shadow-[0_2px_3px_rgba(0,0,0,0.18)] transition-colors ${
                  activeTab === tab
                    ? "bg-[#0b142b] font-semibold text-white"
                    : "bg-white text-[#1d2636] hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="w-full max-w-[955px] rounded-[14px] border border-[#999] px-6 py-5 sm:px-10 sm:py-8">
            {renderActiveContent()}
          </div>
        </section>

        <footer className="flex min-h-[49px] items-center justify-end gap-6 bg-[#0b142b] px-8 text-[9px] text-white sm:gap-9">
          <a href="#privacy" className="hover:opacity-70">Privacy Policy</a>
          <a href="#terms" className="hover:opacity-70">Terms of Service</a>
          <a href="#contact" className="hover:opacity-70">Contact us</a>
        </footer>
      </div>
    </main>
  );
}
