import { create } from "zustand"
import { persist } from "zustand/middleware"

// Réglages de lecture configurables par l'utilisateur, persistés en localStorage.
export type AudioSettings = { crossfadeEnabled: boolean; crossfadeDuration: number }

type AudioSettingsStore = AudioSettings & {
  setCrossfadeEnabled: (value: boolean) => void
  setCrossfadeDuration: (value: number) => void
}

// Bornes du fondu enchaîné (secondes).
export const CROSSFADE_MIN = 1
export const CROSSFADE_MAX = 12

export const useAudioSettingsStore = create<AudioSettingsStore>()(
  persist(
    (set) => ({
      crossfadeEnabled: false,
      crossfadeDuration: 6,
      setCrossfadeEnabled: (crossfadeEnabled) => set({ crossfadeEnabled }),
      setCrossfadeDuration: (crossfadeDuration) => set({ crossfadeDuration }),
    }),
    { name: "kmotion-audio-settings", version: 1 },
  ),
)
