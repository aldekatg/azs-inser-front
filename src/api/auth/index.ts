import { api } from "@/api"
import { Response } from "@/types.ts"
import { AuthPayload } from "@/api/auth/type.ts"

const URLS = {
  login: "/auth/gas-station/login",
  refresh: "/auth/refresh",
}

export async function refreshAccessToken(refreshToken: string) {
  return api
    .post<Response<AuthPayload>>(URLS.refresh, { refresh_token: refreshToken })
    .then((resp) => resp.data)
}
export const login = (email: string, password: string) =>
  api
    .post<Response<AuthPayload>>(URLS.login, { email, password })
    .then((resp) => resp.data)
