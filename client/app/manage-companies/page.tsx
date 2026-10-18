"use client";

import { useEffect, useState } from "react";

type CompanyItem = {
  id: number | string;
  name: string;
  email: string;
  status: string;
};

const defaultCompanies: CompanyItem[] = [
  {
    id: 1,
    name: "Tech Solutions Lanka",
    email: "contact@techsolutions.lk",
    status: "Active",
  },
  {
    id: 2,
    name: "Innovate Sri Lanka",
    email: "hello@innovatesl.lk",
    status: "Active",
  },
  {
    id: 3,
    name: "Future Tech",
    email: "info@futuretech.lk",
    status: "Pending",
  },
];

export default function ManageCompaniesPage() {
  const [companyList, setCompanyList] = useState<CompanyItem[]>(defaultCompanies);

  useEffect(() => {
    fetch("/api/companies?status=all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: CompanyItem[] = data.data.map(
            (c: { _id?: string; id?: number; name?: string; email?: string; status?: string }, idx: number) => ({
              id: c._id || c.id || idx + 1,
              name: c.name || "Company Name",
              email: c.email || "contact@company.com",
              status: c.status || "Active",
            })
          );
          setCompanyList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Manage Companies
        </h1>

        <p className="mt-2 text-gray-600">
          Manage registered companies and their accounts.
        </p>

        <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Company</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {companyList.map((company) => (
                <tr key={company.id} className="border-t">
                  <td className="px-6 py-4 font-medium">
                    {company.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {company.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        company.status === "Verified" || company.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : company.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {company.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}