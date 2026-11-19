"use client";

import { FormEvent, useState } from "react";

export type EditableInternship = {
  _id: string;
  title: string;
  status: string;
  location: string;
  category?: string;
  type?: string;
  duration?: string;
  deadline?: string | null;
  description?: string;
  requirements?: string;
  skills?: string[];
  salary?: string;
  applicationsCount?: number;
};

type FormValues = {
  title: string;
  location: string;
  category: string;
  type: string;
  duration: string;
  deadline: string;
  description: string;
  requirements: string;
  skills: string;
  salary: string;
};

function dateInput(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : "";
}

function initialValues(post: EditableInternship): FormValues {
  return {
    title: post.title || "",
    location: post.location || "",
    category: post.category || "IT",
    type: post.type || "Full Time",
    duration: post.duration || "",
    deadline: dateInput(post.deadline),
    description: post.description || "",
    requirements: post.requirements || "",
    skills: Array.isArray(post.skills) ? post.skills.join(", ") : "",
    salary: post.salary || "",
  };
}

export function EmployerEditPost({
  post,
  onCancel,
  onUpdated,
}: {
  post: EditableInternship;
  onCancel: () => void;
  onUpdated: () => Promise<void>;
}) {
  const [form, setForm] = useState<FormValues>(() => initialValues(post));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 disabled:opacity-60";

  const set = (field: keyof FormValues, value: string) =>
    setForm(current => ({ ...current, [field]: value }));

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const skills = [...new Set(form.skills.split(",").map(skill => skill.trim()).filter(Boolean))];
    if (form.title.trim().length < 3 || !form.location.trim() || !form.description.trim()) {
      setError("Enter a valid title, location and description.");
      return;
    }
    if (skills.length > 30 || skills.some(skill => skill.length > 60)) {
      setError("Add no more than 30 skills, with at most 60 characters per skill.");
      return;
    }

    // Do not resend an unchanged, now-expired deadline when editing an old
    // listing. The server requires newly supplied deadlines to be in the future.
    const payload: Record<string, string | string[] | null> = {
      title: form.title.trim(),
      location: form.location.trim(),
      category: form.category,
      type: form.type,
      duration: form.duration.trim(),
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      skills,
      salary: form.salary.trim(),
    };
    if (form.deadline !== dateInput(post.deadline)) {
      payload.deadline = form.deadline || null;
    }

    setBusy(true);
    try {
      const response = await fetch(`/api/jobs/${encodeURIComponent(post._id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not save internship changes.");
      }
      await onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update internship.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="edit-internship" aria-labelledby="edit-internship-title"
      className="scroll-mt-36 mt-6 rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="edit-internship-title" className="text-xl font-bold">Edit internship post</h2>
          <p className="mt-1 text-sm text-slate-600">
            Edit your published details. Existing student applications and statuses stay unchanged.
          </p>
          {["Closed", "Expired"].includes(post.status) && (
            <p className="mt-2 text-sm font-medium text-amber-700">
              This listing is {post.status.toLowerCase()}. Editing its details will not reopen it.
            </p>
          )}
        </div>
        <button type="button" onClick={onCancel} disabled={busy}
          className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">
          Cancel
        </button>
      </div>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Job title
          <input required minLength={3} maxLength={150} value={form.title}
            onChange={e => set("title", e.target.value)} className={input} disabled={busy} />
        </label>
        <label className="text-sm font-semibold">Location
          <input required maxLength={120} value={form.location}
            onChange={e => set("location", e.target.value)} className={input} disabled={busy} />
        </label>
        <label className="text-sm font-semibold">Category
          <select value={form.category} onChange={e => set("category", e.target.value)} className={input} disabled={busy}>
            {["IT", "Marketing", "Finance", "Engineering", "Other"].map(x => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">Employment type
          <select value={form.type} onChange={e => set("type", e.target.value)} className={input} disabled={busy}>
            {["Full Time", "Part Time", "Remote", "Hybrid"].map(x => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">Duration
          <input maxLength={80} value={form.duration}
            onChange={e => set("duration", e.target.value)} className={input} disabled={busy} />
        </label>
        <label className="text-sm font-semibold">Application deadline
          <input type="date" value={form.deadline}
            onChange={e => set("deadline", e.target.value)} className={input} disabled={busy} />
          <span className="mt-1 block text-xs font-normal text-slate-500">Leave blank for no deadline. New deadlines must be future dates.</span>
        </label>
        <label className="text-sm font-semibold sm:col-span-2">Skills (comma-separated)
          <input value={form.skills} onChange={e => set("skills", e.target.value)}
            placeholder="React, Git, SQL" className={input} disabled={busy} />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">Description
          <textarea required maxLength={10000} rows={5} value={form.description}
            onChange={e => set("description", e.target.value)} className={input} disabled={busy} />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">Requirements
          <textarea maxLength={10000} rows={3} value={form.requirements}
            onChange={e => set("requirements", e.target.value)} className={input} disabled={busy} />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">Salary / stipend (optional)
          <input maxLength={120} value={form.salary}
            onChange={e => set("salary", e.target.value)} className={input} disabled={busy} />
        </label>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" disabled={busy}
            className="rounded-xl bg-[#ff7417] px-6 py-3 text-sm font-bold text-white hover:bg-[#e86b13] disabled:opacity-50">
            {busy ? "Saving changes..." : "Save changes"}
          </button>
          <button type="button" onClick={onCancel} disabled={busy}
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold disabled:opacity-50">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
