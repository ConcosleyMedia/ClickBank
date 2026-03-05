import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BrainRank</span>
          </Link>

          {/* Right side - Auth buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/start"
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
            >
              Start Test
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
