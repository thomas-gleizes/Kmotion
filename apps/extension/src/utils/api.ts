import axios from "axios"
import { STORAGE_KEY } from "../resources/constants"
import { LoginDto } from "../../../../packages/validations"
import { LoginResponse } from "../../../../packages/types"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

instance.interceptors.request.use(async (config) => {
  const token = await chrome.storage.local.get(STORAGE_KEY.AUTH_TOKEN)

  if (token) config.headers.Authorization = `Bearer ${token}`

  return config
})

export const login = async (values: LoginDto) => instance.post<LoginResponse>("/login", values)
