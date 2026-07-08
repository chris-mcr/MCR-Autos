import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* 404 Container */}
        <div className="text-center">
          {/* 404 Icon */}
          <div className="text-7xl mb-4">🎮</div>

          {/* 404 Code */}
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
            404
          </h1>

          {/* Page Title */}
          <h2 className="text-2xl font-semibold text-white mb-3">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-slate-300 mb-8 leading-relaxed">
            We couldn&apos;t find the page you were looking for. Let&apos;s get you back on track.
          </p>

          {/* Search Suggestions */}
          <div className="mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <p className="text-sm text-slate-400 mb-3">Popular Pages:</p>
            <div className="space-y-2 text-sm">
              <Link
                href="/"
                className="block text-blue-400 hover:text-blue-300 transition-colors"
                data-testid="404-home-link"
              >
                → Home
              </Link>
              <Link
                href="/shop"
                className="block text-blue-400 hover:text-blue-300 transition-colors"
                data-testid="404-shop-link"
              >
                → Shop
              </Link>
              <Link
                href="/login"
                className="block text-blue-400 hover:text-blue-300 transition-colors"
                data-testid="404-login-link"
              >
                → Login
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              data-testid="404-home-button"
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Home
            </Link>

            <Link
              href="/shop"
              data-testid="404-shop-button"
              className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Shop
            </Link>
          </div>

          {/* Easter Egg */}
          <p className="text-slate-500 text-xs mt-8">
            🔧 Torque Auto Parts
          </p>
        </div>
      </div>
    </div>
  )
}
