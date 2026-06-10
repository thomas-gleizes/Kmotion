const TOKEN_KEY = "Kmotion_token"

export type AuthPayload = {
  sub: string
  email: string
  name: string
  isActive: boolean
  isAdmin: boolean
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}

export function decodeJwt(token: string): AuthPayload | null {
  try {
    const payload = token.split(".")[1]
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
  } catch {
    return null
  }
}

export function getCurrentUser(): AuthPayload | null {
  const token = getToken()
  return token ? decodeJwt(token) : null
}

export function logout() {
  clearToken()
  window.location.href = "/login"
}
