"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type StudentRow = [string, string, string, string, string];

const defaultStudents: StudentRow[] = [
  ["Sarah Williams", "STU-1024", "sarah.williams@email.com", "Computer Science", "Active"],
  ["Michael Perera", "STU-1025", "michael.perera@email.com", "Information Technology", "Active"],
  ["Ayesha Fernando", "STU-1026", "ayesha.fernando@email.com", "Software Engineering", "Inactive"],
  ["Daniel Silva", "STU-1027", "daniel.silva@email.com", "Data Science", "Active"],
  ["Nethmi Jayasinghe", "STU-1028", "nethmi.j@email.com", "Information Systems", "Pending"],
];

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const [studentList, setStudentList] = useState<StudentRow[]>(defaultStudents);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: StudentRow[] = data.data.map(
            (s: { fullName?: string; id?: string; _id?: string; email?: string; education?: string; status?: string }, idx: number) => [
              s.fullName || "Student",
              s.id || `STU-${1020 + idx}`,
              s.email || "student@email.com",
              s.education || "Computer Science",
              s.status || "Active",
            ]
          );
          setStudentList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const visible = studentList.filter((student) =>
    student.join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="il-page-enter min-h-screen bg-[#f6f8fc] p-6 lg:p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Manage Students</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage registered student accounts.</p>
        </div>
        <button type="button" className="rounded-xl bg-[#ff7a00] px-5 py-3 text-sm font-semibold text-white">
          + Add Student
        </button>
      </header>

      <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
        <label className="flex max-w-xl items-center gap-2 rounded-xl border border-gray-200 px-4 py-3">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search students by name, email, ID or course..."
            className="w-full text-sm outline-none"
          />
        </label>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-gray-500">
                <th className="px-3 py-3">Student</th>
                <th className="px-3 py-3">Student ID</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Course</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(([name, id, email, course, status]) => (
                <tr key={id} className="border-b last:border-0">
                  <td className="px-3 py-4 font-medium">{name}</td>
                  <td className="px-3 py-4 text-gray-500">{id}</td>
                  <td className="px-3 py-4 text-gray-500">{email}</td>
                  <td className="px-3 py-4">{course}</td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        status === "Active"
                          ? "bg-green-100 text-green-700"
                          : status === "Pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <button type="button" className="text-xs font-semibold text-orange-500 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Link href="/admin/dashboard" className="mt-5 inline-block text-sm text-orange-500 hover:underline">
        Back to dashboard
      </Link>
    </main>
  );
}
