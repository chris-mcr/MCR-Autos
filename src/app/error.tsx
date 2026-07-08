'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Error Container */}
        <div className="text-center">
          {/* Error Icon */}
          <div className="text-6xl mb-4 animate-bounce">⚠️</div>

          {/* Error Code */}
          <h1 className="text-5xl font-bold text-red-400 mb-2">Oops!</h1>

          {/* Error Title */}
          <h2 className="text-2xl font-semibold text-white mb-3">
            Something went wrong
          </h2>

          {/* Error Message */}
          <p className="text-slate-300 mb-6 leading-relaxed">
            We hit an unexpected error. Please try again — your cart is safe.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
              <p className="text-xs font-mono text-red-300 break-words">
                {error.message || 'Unknown error'}
              </p>
              {error.digest && (
                <p className="text-xs text-slate-400 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              data-testid="error-retry-button"
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>

            <Link
              href="/"
              data-testid="error-home-button"
              className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-center"
            >
              Back to Home
            </Link>

            <button
              onClick={() => router.back()}
              data-testid="error-back-button"
              className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors border border-slate-600"
            >
              Go Back
            </button>
          </div>

          {/* Helpful Text */}
          <p className="text-slate-500 text-sm mt-6">
            If the problem persists, try refreshing the page or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
