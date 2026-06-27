import { Link } from 'react-router-dom'

import { paths } from '@/routes/paths'

/** Fallback page rendered for any unmatched route. */
export default function NotFoundPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <p className="text-6xl font-bold text-slate-300">404</p>
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <Link
        to={paths.home}
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        Back to home
      </Link>
    </main>
  )
}
