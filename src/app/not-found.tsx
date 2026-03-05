import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200">404</div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/start"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Take the IQ Test
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Or try these pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/help" className="text-teal-600 hover:underline">Help Center</Link>
            <span className="text-gray-300">•</span>
            <Link href="/pricing" className="text-teal-600 hover:underline">Pricing</Link>
            <span className="text-gray-300">•</span>
            <Link href="/sign-in" className="text-teal-600 hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
