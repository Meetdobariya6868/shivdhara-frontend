import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ShivdharaLogo } from '@/components/ShivdharaLogo'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/features/auth/store/auth.store'

const SPLASH_DURATION_MS = 2500

/**
 * Splash screen shown on initial app load.
 *
 * After SPLASH_DURATION_MS it redirects to:
 *   • /dashboard  — if a session token is present in the auth store.
 *   • /login      — if the user is unauthenticated.
 *
 * Token validity is checked lazily: if the stored token is revoked the user
 * will be redirected to /login by the axios 401 interceptor on the next API call.
 */
export default function SplashPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  useEffect(() => {
    const timer = setTimeout(() => {
      const destination = isAuthenticated ? paths.dashboard : paths.auth.login
      void navigate(destination, { replace: true })
    }, SPLASH_DURATION_MS)

    return () => clearTimeout(timer)
  }, [isAuthenticated, navigate])

  return (
    <main className="flex h-full flex-col bg-background">

      {/* ── Brand name (top) ─────────────────────────────────────────── */}
      <header className="animate-fade-in pt-14 text-center">
        <span className="text-sm font-semibold tracking-[0.25em] text-primary uppercase">
          Shivdhara
        </span>
      </header>

      {/* ── Logo (centre) ────────────────────────────────────────────── */}
      <section
        className="flex flex-1 animate-fade-in items-center justify-center"
        style={{ animationDelay: '0.2s' }}
        aria-label="Shivdhara logo"
      >
        <ShivdharaLogo size={180} />
      </section>

      {/* ── Tagline (bottom) ─────────────────────────────────────────── */}
      <footer
        className="animate-fade-in pb-14 text-center"
        style={{ animationDelay: '0.4s' }}
      >
        <p className="text-lg font-semibold text-foreground">Marbo &amp; Granite</p>
        <p className="mt-1 text-sm text-muted">Welcome, to our community</p>
      </footer>

    </main>
  )
}
