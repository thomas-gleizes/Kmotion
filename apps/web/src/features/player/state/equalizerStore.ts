import { create } from "zustand"
import { persist } from "zustand/middleware"

export type EqualizerBand = "bass" | "mid" | "treble"

export type EqualizerSettings = {
  bass: number
  mid: number
  treble: number
}

export const EQ_MIN_DB = -12
export const EQ_MAX_DB = 12

const defaultSettings: EqualizerSettings = { bass: 0, mid: 0, treble: 0 }

type EqualizerStore = {
  settings: EqualizerSettings
  setBand: (band: EqualizerBand, gainDb: number) => void
  reset: () => void
}

// Réglages d'égaliseur persistés en localStorage, appliqués au graphe Web Audio
// par PlayerContext quel que soit le titre en cours.
export const useEqualizerStore = create<EqualizerStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setBand: (band, gainDb) =>
        set((state) => ({ settings: { ...state.settings, [band]: gainDb } })),
      reset: () => set({ settings: defaultSettings }),
    }),
    { name: "kmotion-equalizer", version: 1 },
  ),
)
