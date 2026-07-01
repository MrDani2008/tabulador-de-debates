export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">Tournament Public Portal</h1>
          <nav className="flex space-x-4">
            <a
              href="/public/pairings"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Pairings
            </a>
            <a
              href="/public/standings"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Standings
            </a>
            <a
              href="/public/results"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Results
            </a>
            <a
              href="/public/statistics"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Statistics
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
