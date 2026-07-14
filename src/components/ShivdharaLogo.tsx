import logoUrl from '@/assets/logo.png'

interface ShivdharaLogoProps {
  size?: number
  className?: string
}

/**
 * Shivdhara brand logo.
 *
 * Renders the bundled logo image from `src/assets/logo.png` (Vite hashes and
 * optimises it at build time). `size` sets the width; height scales
 * automatically so the image keeps its natural aspect ratio. Replace
 * `src/assets/logo.png` to change the logo — no code change needed.
 */
export function ShivdharaLogo({ size = 120, className }: ShivdharaLogoProps) {
  return (
    <img
      src={logoUrl}
      alt="Shivdhara logo"
      width={size}
      style={{ width: size, height: 'auto' }}
      className={className}
    />
  )
}
