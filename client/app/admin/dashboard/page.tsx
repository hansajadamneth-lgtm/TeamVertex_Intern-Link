const stats = [
  {
    title: "Total Users",
    value: "2,450",
    change: "+12.5%",
  },
  {
    title: "Active Jobs",
    value: "135",
    change: "+8.2%",
  },
  {
    title: "Companies",
    value: "82",
    change: "+5.4%",
  },
  {
    title: "Applications",
    value: "4,650",
    change: "+15.8%",
  },
];

const recentJobs = [
  {
    title: "Software Engineering Intern",
    company: "ABC Technologies",
    status: "Active",
    date: "20 Jul 2026",
  },
  {
    title: "UI/UX Design Intern",
    company: "DesignHub",
    status: "Pending",
    date: "18 Jul 2026",
  },
  {
    title: "Marketing Intern",
    company: "MarketBridge",
    status: "Active",
    date: "16 Jul 2026",
  },
  {
    title: "Data Science Intern",
    company: "InnovateX Labs",
    status: "Closed",
    date: "14 Jul 2026",
  },
];

const recentUsers = [
  {
    name: "John Perera",
    email: "john@example.com",
    type: "Student",
  },
  {
    name: "Sarah Fernando",
    email: "sarah@example.com",
    type: "Student",
  },
  {
    name: "Tech Solutions",
    email: "contact@tech.lk",
    type: "Company",
  },
  {
    name: "DesignHub",
    email: "hello@designhub.lk",
    type: "Company",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
     {/* Top bar */}
<header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
  {/* Left side */}
  <div className="flex items-center gap-4">
    <button className="text-2xl text-gray-700">
      ☰
    </button>

    <h1 className="text-xl font-semibold text-gray-800">
      Dashboard
    </h1>
  </div>

  {/* Right side */}
  <div className="flex items-center gap-5">
    {/* Search */}
    <div className="flex h-10 w-56 items-center rounded-full border border-gray-200 bg-white px-4">
      <span className="mr-2 text-gray-400">
        ⌕
      </span>

      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
      />
    </div>

    {/* Notification */}
    <button className="text-xl text-gray-700">
      🔔
    </button>

    {/* Profile */}
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
        👤
      </div>

      <div className="text-xs">
        <p className="font-semibold text-gray-800">
          Name
        </p>

        <p className="text-gray-500">
          Email Address
        </p>
      </div>
    </div>
  </div>
</header>

      {/* Dashboard content */}
      <section className="p-6">
        {/* Welcome banner */}
        <div className="mb-6 rounded-xl bg-[#596170] p-6 text-white">
          <h2 className="text-2xl font-semibold">
            Welcome back!
          </h2>

          <p className="mt-2 text-sm text-gray-200">
            Here&apos;s what&apos;s happening with your platform today.
          </p>

          <p className="mt-4 text-xs text-gray-300">
            15 Jul 2026, Wednesday
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>

              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </p>

                <span className="text-xs font-semibold text-green-600">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main dashboard sections */}
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {/* Recent Jobs */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">
                Recent Job Posts
              </h2>

              <button className="text-xs font-semibold text-orange-500">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs text-gray-500">
                    <th className="pb-3">Job Title</th>
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentJobs.map((job) => (
                    <tr
                      key={job.title}
                      className="border-b last:border-0"
                    >
                      <td className="py-3 font-medium text-gray-700">
                        {job.title}
                      </td>

                      <td className="py-3 text-gray-500">
                        {job.company}
                      </td>

                      <td className="py-3">
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                          {job.status}
                        </span>
                      </td>

                      <td className="py-3 text-gray-500">
                        {job.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Growth */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">
                User Growth
              </h2>

              <select className="rounded border px-2 py-1 text-xs">
                <option>Year</option>
                <option>Month</option>
              </select>
            </div>

            <div className="mt-8 flex h-48 items-end justify-between gap-3 border-b border-l px-4 pb-2">
              {[45, 70, 50, 85, 65, 95, 75, 110, 80, 125, 90, 145].map(
                (height, index) => (
                  <div
                    key={index}
                    className="w-full rounded-t bg-orange-400"
                    style={{ height: `${height}px` }}
                  />
                )
              )}
            </div>

            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              Recent Users
            </h2>

            <button className="text-xs font-semibold text-orange-500">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-gray-500">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Type</th>
                </tr>
              </thead>

              <tbody>
                {recentUsers.map((user) => (
                  <tr
                    key={user.email}
                    className="border-b last:border-0"
                  >
                    <td className="py-3 font-medium text-gray-700">
                      {user.name}
                    </td>

                    <td className="py-3 text-gray-500">
                      {user.email}
                    </td>

                    <td className="py-3">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        {user.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}