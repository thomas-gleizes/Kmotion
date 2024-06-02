import axios from "axios"

import { LoginDto } from "@kmotion/validations"
import { Track, LoginResponse, MusicInfoResponse } from "@kmotion/types"
import { STORAGE_KEY } from "../resources/constants"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const baseURL = import.meta.env.VITE_API_URL

const instance = axios.create({
  baseURL: baseURL,
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

export const downloadMusic = async (youtubeId: string) => instance.post(`/musics/${youtubeId}/add`)

export const streamMusic = async (id: string) => {
  const storage = await chrome.storage.local.get([STORAGE_KEY.AUTH_TOKEN])

  return fetch(`${baseURL}/musics/${id}/stream`, {
    method: "GET",
    headers: {
      "Content-Type": "audio/mpeg",
      Authorization: `Bearer ${storage[STORAGE_KEY.AUTH_TOKEN]}`,
    },
  })
}

export const convertMusic = async (youtubeId: string, payload: Track) =>
  instance.post(`/musics/${youtubeId}/add`, payload)
