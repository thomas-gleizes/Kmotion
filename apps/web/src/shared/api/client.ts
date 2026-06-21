import createClient, { type Middleware } from "openapi-fetch"
import type { paths } from "../../../types/openapi"
import { getToken, logout } from "@/features/auth/auth"

// Les paths générés incluent déjà le préfixe /api/3.1 ; le proxy Vite route /api vers le backend.
export const api = createClient<paths>({ baseUrl: "/" })

const authMiddleware: Middleware = {
  onRequest({ request }) {
    const token = getToken()
    if (token) request.headers.set("Authorization", `Bearer ${token}`)
    return request
  },
  onResponse({ response }) {
    if (response.status === 401 && getToken()) logout()
    return response
  },
}

api.use(authMiddleware)

// Fetch brut authentifié pour les endpoints binaires (audio, thumbnail).
export async function authedFetch(path: string): Promise<Blob> {
  const token = getToken()
  const response = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (response.status === 401 && getToken()) logout()
  if (!response.ok) throw new Error(`Échec de la requête ${path} (${response.status})`)
  return response.blob()
}
