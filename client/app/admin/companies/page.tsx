export default function ManageCompaniesPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] p-6">

      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <button className="text-2xl text-gray-700">
            ☰
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">
            Companies
          </h1>
        </div>

        <div className="flex items-center gap-6">

          {/* Search */}
          <div className="flex h-10 w-64 items-center rounded-full bg-white px-4 shadow-sm">
            <span className="mr-2 text-gray-500">⌕</span>
            <span className="text-sm text-gray-400">
              Search
            </span>
          </div>

          {/* Notification */}
          <span className="text-2xl">🔔</span>

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              👤
            </div>

            <div className="text-sm">
              <p className="font-semibold text-gray-800">
                Name
              </p>
              <p className="text-gray-500">
                Email Address
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Total Companies */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Companies
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-gray-900">
              36
            </p>

            <p className="text-xs text-green-600">
              ↑ 12.5% vs last month
            </p>
          </div>
        </div>

        {/* Verified Companies */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Verified Companies
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-gray-900">
              28
            </p>

            <p className="text-xs text-green-600">
              ↑ 12.5% vs last month
            </p>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Approval
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-gray-900">
              8
            </p>

            <p className="text-xs text-green-600">
              ↑ 12.5% vs last month
            </p>
          </div>
        </div>

        {/* Suspended */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Approval
          </p>

          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-semibold text-gray-900">
              2
            </p>

            <p className="text-xs text-red-500">
              ↓ 12.5% vs last month
            </p>
          </div>
        </div>

      </div>

      {/* Search + Add Company */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

        <div className="flex h-11 flex-1 items-center rounded-full border border-gray-200 px-4">
          <span className="mr-3 text-gray-400">
            ⌕
          </span>

          <span className="text-sm text-gray-400">
            Search companies by name, email, industry...
          </span>
        </div>
              {/* Companies Table */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">

        {/* Table Header */}
        <div className="grid grid-cols-6 border-b border-gray-200 px-6 py-4 text-sm font-semibold text-gray-700">

          <div>Company</div>
          <div>Industry</div>
          <div>Email</div>
          <div>Status</div>
          <div>Joined Date</div>
          <div>Actions</div>

        </div>

        {/* Company 1 */}
        <div className="grid grid-cols-6 items-center border-b border-gray-100 px-6 py-4 text-sm">

          <div>
            <p className="font-medium text-gray-800">
              ABC Technologies (Pvt) Ltd
            </p>
            <p className="text-xs text-gray-500">
              www.abctech.com
            </p>
          </div>

          <div className="text-gray-600">
            Information Technology
          </div>

          <div className="text-gray-600">
            contact@abctech.com
          </div>

          <div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Verified
            </span>
          </div>

          <div className="text-gray-600">
            10 Jan 2026
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              👁
            </button>

            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              ⋮
            </button>
          </div>

        </div>

        {/* Company 2 */}
        <div className="grid grid-cols-6 items-center border-b border-gray-100 px-6 py-4 text-sm">

          <div>
            <p className="font-medium text-gray-800">
              TechNova Solutions
            </p>
            <p className="text-xs text-gray-500">
              www.technova.lk
            </p>
          </div>

          <div className="text-gray-600">
            Software Development
          </div>

          <div className="text-gray-600">
            info@technova.lk
          </div>

          <div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Verified
            </span>
          </div>

          <div className="text-gray-600">
            25 Jan 2026
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              👁
            </button>

            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              ⋮
            </button>
          </div>

        </div>

        {/* Company 3 */}
        <div className="grid grid-cols-6 items-center border-b border-gray-100 px-6 py-4 text-sm">

          <div>
            <p className="font-medium text-gray-800">
              Global Finance Corp
            </p>
            <p className="text-xs text-gray-500">
              www.globalfinance.com
            </p>
          </div>

          <div className="text-gray-600">
            Finance
          </div>

          <div className="text-gray-600">
            hr@globalfinance.com
          </div>

          <div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
              Suspended
            </span>
          </div>

          <div className="text-gray-600">
            20 Jan 2026
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              👁
            </button>

            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              ⋮
            </button>
          </div>

        </div>

        {/* Company 4 */}
        <div className="grid grid-cols-6 items-center border-b border-gray-100 px-6 py-4 text-sm">

          <div>
            <p className="font-medium text-gray-800">
              DesignHub (Pvt) Ltd
            </p>
            <p className="text-xs text-gray-500">
              www.designhub.com
            </p>
          </div>

          <div className="text-gray-600">
            Design & Creative
          </div>

          <div className="text-gray-600">
            hello@designhub.com
          </div>

          <div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Verified
            </span>
          </div>

          <div className="text-gray-600">
            19 Jan 2026
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              👁
            </button>

            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              ⋮
            </button>
          </div>

        </div>

        {/* Company 5 */}
        <div className="grid grid-cols-6 items-center px-6 py-4 text-sm">

          <div>
            <p className="font-medium text-gray-800">
              InnovateX Labs
            </p>
            <p className="text-xs text-gray-500">
              www.innovatex.lk
            </p>
          </div>

          <div className="text-gray-600">
            Research & Development
          </div>

          <div className="text-gray-600">
            careers@innovatex.lk
          </div>

          <div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Verified
            </span>
          </div>

          <div className="text-gray-600">
            16 Jan 2026
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              👁
            </button>

            <button className="rounded-lg border px-3 py-1 hover:bg-gray-100">
              ⋮
            </button>
          </div>

        </div>

      </div>

        <button className="rounded-lg bg-[#ff7a00] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e96d00]">
          + Add Companies
        </button>

      </div>

    </main>
  );
}