/* eslint-disable react-refresh/only-export-components */
/*
 * Router files by design export a non-component (the router object) alongside
 * lazy component references. Disabling the Fast Refresh rule here is intentional
 * and safe — changes to this file always trigger a full page reload anyway.
 */
import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AuthGuard } from '@/app/router/guards/AuthGuard'
import { GuestGuard } from '@/app/router/guards/GuestGuard'
import { PageLoader } from '@/components/PageLoader'
import NotFoundPage from '@/pages/NotFoundPage'
import { paths } from '@/routes/paths'

// ── Lazy-loaded pages (one JS chunk per route) ────────────────────────────────
const SplashPage = lazy(() => import('@/pages/SplashPage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))

/** Wrap any route element with Suspense so lazy chunks never throw. */
function withSuspense(node: ReactNode): ReactNode {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>
}

/**
 * Application router (React Router v7).
 * All business pages are lazy-loaded so the initial JS bundle stays minimal.
 */
export const router = createBrowserRouter([
  // ── Splash — public, no guard ─────────────────────────────────────────────
  {
    path: paths.splash,
    element: withSuspense(<SplashPage />),
  },

  // ── Guest-only (authenticated users → /dashboard) ─────────────────────────
  {
    element: <GuestGuard />,
    children: [
      {
        path: paths.auth.login,
        element: withSuspense(<LoginPage />),
      },
    ],
  },

  // ── Protected (unauthenticated users → /login) ────────────────────────────
  {
    element: <AuthGuard />,
    children: [
      {
        path: paths.dashboard,
        element: withSuspense(<DashboardPage />),
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
