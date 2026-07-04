/** Payload for PUT /v1/profile — the authenticated user's own name + mobile. */
export interface UpdateProfilePayload {
  name: string
  mobile_number: string
}
