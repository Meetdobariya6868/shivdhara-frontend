/**
 * Red asterisk marking a required field on a form label. Decorative only
 * (`aria-hidden`) — the field's control carries `aria-required` for assistive
 * tech, so the mark is never announced twice.
 */
export function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-error">
      *
    </span>
  )
}
