
"use client";
import { useState } from "react";
export default function AddInternshipPostPage() {
  const [jobTitle, setJobTitle] = useState("");
  return (
    <main className="min-h-screen bg-[#f7f7f7] p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-[#1a2333]">
          Add New Internship Post
        </h1>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Job Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                placeholder="Enter job title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ff7a00]"
              />
            </div>

            {/* Company */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Company
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ff7a00]">
                <option>Select company</option>
                <option>TechNova Solutions</option>
                <option>InnovateX Labs</option>
                <option>DesignHub (Pvt) Ltd</option>
                <option>MarketBridge (Pvt) Ltd</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ff7a00]"
              />
            </div>

            {/* Internship Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Internship Type
              </label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ff7a00]">
                <option>Select type</option>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Duration
              </label>
              <input
                type="text"
                placeholder="Example: 6 Months"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ff7a00]"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Application Deadline
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ff7a00]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Internship Description
            </label>
            <textarea
              rows={5}
              placeholder="Enter internship description..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ff7a00]"
            />
          </div>

          {/* Requirements */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Requirements
            </label>
            <textarea
              rows={4}
              placeholder="Enter internship requirements..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#ff7a00]"
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
  type="button"
  onClick={() => window.location.href = "/admin/internship-posts"}
  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
>
  Cancel
</button>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/admin/internship-posts";
              }}
              className="rounded-lg bg-[#ff7a00] px-6 py-3 font-semibold text-white hover:bg-[#e96d00]"
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}