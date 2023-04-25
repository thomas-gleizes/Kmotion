import axios from "axios"
import { STORAGE_KEY } from "../resources/constants"
import { LoginDto } from "@kmotion/validations"
import { LoginResponse, MusicInfoResponse } from "@kmotion/types"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

instance.interceptors.request.use(async (config) => {
  const storage = await chrome.storage.local.get([STORAGE_KEY.AUTH_TOKEN])

  if (storage[STORAGE_KEY.AUTH_TOKEN])
    config.headers.Authorization = `Bearer ${storage[STORAGE_KEY.AUTH_TOKEN]}`

  return config
})

export const login = async (values: LoginDto) => instance.post<LoginResponse>("/auth/login", values)

export const fetchVideoInfo = async (youtubeId: string) =>
  instance.get<MusicInfoResponse>(`/musics/${youtubeId}/info`)

export const downloadMusic = async (youtubeId: string) =>
  instance.get(`/musics/${youtubeId}/download`)
