interface ShivdharaLogoProps {
  size?: number
  className?: string
}

/**
 * Shivdhara brand logo — two stacked Venn-diagram sections in the brand
 * palette, separated by white lines, forming the distinctive S mark.
 *
 * Top section : steel-blue (left) + khaki (right) with sage overlap.
 * Bottom section: dusty-rose (left) + steel-blue (right) with slate overlap.
 */
export function ShivdharaLogo({ size = 120, className }: ShivdharaLogoProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.27)}
      viewBox="0 0 120 152"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Shivdhara logo"
      className={className}
    >
      <defs>
        <clipPath id="sd-clip-top">
          <rect x="0" y="0" width="120" height="72" />
        </clipPath>
        <clipPath id="sd-clip-bottom">
          <rect x="0" y="82" width="120" height="72" />
        </clipPath>
      </defs>

      {/* ── TOP SECTION ─────────────────────────────────────────────────── */}
      {/* Steel-blue petal (left-dominant) */}
      <ellipse
        cx="43"
        cy="38"
        rx="50"
        ry="38"
        fill="#7BA4B8"
        clipPath="url(#sd-clip-top)"
      />
      {/* Khaki petal (right-dominant) */}
      <ellipse
        cx="77"
        cy="38"
        rx="50"
        ry="38"
        fill="#B5AE9C"
        clipPath="url(#sd-clip-top)"
      />
      {/* Intersection darkening */}
      <ellipse
        cx="60"
        cy="38"
        rx="19"
        ry="36"
        fill="#4B6E5A"
        clipPath="url(#sd-clip-top)"
        opacity="0.52"
      />

      {/* ── WHITE SEPARATOR ─────────────────────────────────────────────── */}
      <rect x="0" y="72" width="120" height="5" fill="white" />
      <rect x="0" y="77" width="120" height="5" fill="white" />

      {/* ── BOTTOM SECTION (inverted palette) ───────────────────────────── */}
      {/* Dusty-rose petal (left-dominant) */}
      <ellipse
        cx="43"
        cy="116"
        rx="50"
        ry="38"
        fill="#C4A0A0"
        clipPath="url(#sd-clip-bottom)"
      />
      {/* Steel-blue petal (right-dominant) */}
      <ellipse
        cx="77"
        cy="116"
        rx="50"
        ry="38"
        fill="#7BA4B8"
        clipPath="url(#sd-clip-bottom)"
      />
      {/* Intersection darkening */}
      <ellipse
        cx="60"
        cy="116"
        rx="19"
        ry="36"
        fill="#4B5E6E"
        clipPath="url(#sd-clip-bottom)"
        opacity="0.52"
      />

      {/* ── TM MARK ─────────────────────────────────────────────────────── */}
      <text
        x="113"
        y="6"
        fontSize="6"
        fontFamily="sans-serif"
        fill="#9CA3AF"
        textAnchor="middle"
      >
        TM
      </text>
    </svg>
  )
}
