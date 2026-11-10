"use client";

import { useState } from "react";

const internshipPosts = [
  {
    title: "Full Stack Developer Intern",
    company: "TechNova Solutions",
    location: "Galle, Sri Lanka",
    applications: 24,
    status: "Active",
    posted: "18 May 2026",
  },
  {
    title: "Data Analyst Intern",
    company: "InnovateX Labs",
    location: "Kandy, Sri Lanka",
    applications: 17,
    status: "Pending",
    posted: "16 May 2026",
  },
  {
    title: "UI/UX Design Intern",
    company: "DesignHub (Pvt) Ltd",
    location: "Colombo, Sri Lanka",
    applications: 15,
    status: "Active",
    posted: "14 May 2026",
  },
  {
    title: "Marketing Intern",
    company: "MarketBridge (Pvt) Ltd",
    location: "Colombo, Sri Lanka",
    applications: 12,
    status: "Closed",
    posted: "10 May 2026",
  },
];

export default function InternshipPostsPage() {
  const [search, setSearch] = useState("");

  const filteredPosts = internshipPosts.filter((post) =>
    `${post.title} ${post.company} ${post.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="il-page-enter min-h-screen bg-[#f6f8fc]">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <div className="flex items-center gap-4">
          <span className="text-2xl">☰</span>

          <h1 className="text-2xl font-semibold text-[#172033]">
            Internship Posts
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-400">
            🔍 Search
          </div>

          <span className="text-xl">🔔</span>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
              👤
            </div>

            <div className="text-xs">
              <p className="font-semibold text-gray-800">Name</p>
              <p className="text-gray-500">Email Address</p>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-6 lg:p-8">
        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
            <p className="text-sm text-gray-500">Total Posts</p>

            <div className="mt-2 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#172033]">42</h2>

              <span className="text-sm font-semibold text-green-600">
                ↑ 12.5%
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
            <p className="text-sm text-gray-500">Active Posts</p>

            <div className="mt-2 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#172033]">28</h2>

              <span className="text-sm font-semibold text-green-600">
                ↑ 8.2%
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
            <p className="text-sm text-gray-500">Pending Approval</p>

            <div className="mt-2 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#172033]">9</h2>

              <span className="text-sm font-semibold text-green-600">
                ↑ 5.4%
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
            <p className="text-sm text-gray-500">Expired / Closed</p>

            <div className="mt-2 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#172033]">5</h2>

              <span className="text-sm font-semibold text-red-500">
                ↓ 2.5%
              </span>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)] md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search internships by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 md:max-w-xl"
          />

          <button
  type="button"
  onClick={() => window.location.href = "/admin/internship-posts/add"}
  className="rounded-xl bg-[#ff7a00] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e96d00]"
>
  + Add New Post
</button>
        </div>

        {/* Internship Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_28px_-16px_rgba(11,27,62,0.22)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm text-gray-600">
                  <th className="px-5 py-4 font-semibold">Job Title</th>
                  <th className="px-5 py-4 font-semibold">Company</th>
                  <th className="px-5 py-4 font-semibold">Location</th>
                  <th className="px-5 py-4 font-semibold">Applications</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Posted Date</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPosts.map((post, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-5 py-5">
                      <p className="font-semibold text-[#172033]">
                        {post.title}
                      </p>
                    </td>

                    <td className="px-5 py-5 text-sm text-gray-600">
                      {post.company}
                    </td>

                    <td className="px-5 py-5 text-sm text-gray-600">
                      {post.location}
                    </td>

                    <td className="px-5 py-5 text-sm font-semibold text-blue-600">
                      {post.applications}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          post.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : post.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-sm text-gray-600">
                      {post.posted}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          👁
                        </button>

                        <button
                          type="button"
                          className="rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          ⋮
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
            <p>Showing {filteredPosts.length} of 42 posts</p>

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border px-3 py-2"
              >
                ‹
              </button>

              <button
                type="button"
                className="rounded-xl border bg-[#ff7a00] px-3 py-2 text-white"
              >
                1
              </button>

              <button
                type="button"
                className="rounded-xl border px-3 py-2"
              >
                2
              </button>

              <button
                type="button"
                className="rounded-xl border px-3 py-2"
              >
                3
              </button>

              <button
                type="button"
                className="rounded-xl border px-3 py-2"
              >
                4
              </button>

              <button
                type="button"
                className="rounded-xl border px-3 py-2"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}