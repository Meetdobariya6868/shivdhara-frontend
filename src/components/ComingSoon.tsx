interface ComingSoonProps {
  title: string
  phase?: string
}

/**
 * Placeholder for screens slated for a later phase. Keeps navigation
 * functional and themed while the real feature is built.
 */
export function ComingSoon({ title, phase }: ComingSoonProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted">
        {phase ? `Coming in ${phase}.` : 'Coming soon.'}
      </p>
    </div>
  )
}
