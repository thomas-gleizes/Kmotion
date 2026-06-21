import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { RepeatMode, Track } from "@/features/player/state/PlayerContext"

// Instantané de lecture persisté en localStorage : permet de reprendre le
// morceau en cours (et sa position) au retour sur l'application.
export type PlayerSnapshot = {
  queue: Track[]
  order: number[]
  orderPos: number
  currentTime: number
  repeat: RepeatMode
  shuffle: boolean
  volume: number
}

type PlayerStore = {
  snapshot: PlayerSnapshot | null
  save: (snapshot: PlayerSnapshot) => void
  clear: () => void
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      snapshot: null,
      save: (snapshot) => set({ snapshot }),
      clear: () => set({ snapshot: null }),
    }),
    { name: "kmotion-player", version: 1 },
  ),
)
