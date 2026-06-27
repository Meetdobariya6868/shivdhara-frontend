import { useQuery } from '@tanstack/react-query'

import { env } from '@/config/env'
import { httpClient } from '@/lib/axios'

interface HealthResponse {
  status: string
  service: string
  version: string
}

/**
 * Foundation landing page.
 *
 * Doubles as a live wiring check: it issues a TanStack Query through the shared
 * Axios client to the backend `/v1/health` endpoint, proving the full
 * frontend → API chain is connected. It contains no business logic.
 */
export default function HomePage() {
  const { data, status } = useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<HealthResponse> => {
      const response = await httpClient.get<HealthResponse>('/v1/health')
      return response.data
    },
  })

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
        {env.appName}
      </h1>
      <p className="max-w-md text-slate-600">
        Phase&nbsp;1 foundation is ready — React&nbsp;19, TypeScript, Vite,
        Tailwind, Router, Axios, TanStack&nbsp;Query and Zustand are wired up.
      </p>

      <div className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm shadow-sm">
        <span className="font-medium text-slate-700">API health: </span>
        {status === 'pending' && (
          <span className="text-amber-600">checking…</span>
        )}
        {status === 'error' && (
          <span className="text-rose-600">
            unreachable (start the Laravel server)
          </span>
        )}
        {status === 'success' && (
          <span className="text-emerald-600">
            {data.status} · {data.service} · {data.version}
          </span>
        )}
      </div>
    </main>
  )
}
