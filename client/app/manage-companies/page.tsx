const companies = [
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
              {companies.map((company) => (
                <tr key={company.id} className="border-t">
                  <td className="px-6 py-4 font-medium">
                    {company.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {company.email}
                  </td>

                  <td className="px-6 py-4">
                    {company.status}
                  </td>

                  <td className="px-6 py-4">
                    <button className="rounded bg-blue-600 px-4 py-2 text-white">
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