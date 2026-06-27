import { ShivdharaLogo } from '@/components/ShivdharaLogo'

import { LoginForm } from '../components/LoginForm'

/**
 * Login page — visible only to unauthenticated users (GuestGuard).
 * Layout: logo → heading → form, centred vertically on all screen sizes.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-sm animate-slide-up">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <ShivdharaLogo size={110} />
        </div>

        {/* Heading */}
        <h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900">
          Login Your Account
        </h1>

        {/* Form */}
        <LoginForm />

      </div>
    </main>
  )
}
