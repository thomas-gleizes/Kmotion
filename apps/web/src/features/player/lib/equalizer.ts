import type { EqualizerSettings } from "@/features/player/state/equalizerStore"

// Chaîne de filtres Web Audio (bass/medium/treble) branchée une seule fois sur
// l'élément <audio> singleton : createMediaElementSource ne peut être appelé
// qu'une seule fois par élément pour toute la durée de vie de la page.
let context: AudioContext | null = null
let bassFilter: BiquadFilterNode | null = null
let midFilter: BiquadFilterNode | null = null
let trebleFilter: BiquadFilterNode | null = null

export function ensureEqualizerGraph(audio: HTMLAudioElement) {
  if (context) return

  context = new AudioContext()
  // iOS suspend l'AudioContext quand Safari passe en arrière-plan, ce qui
  // coupe le son même si l'élément <audio> continue de "jouer" : on le
  // relance dès que l'OS le suspend pour permettre la lecture en fond.
  context.onstatechange = () => {
    if (context?.state === "suspended") void context.resume()
  }
  const source = context.createMediaElementSource(audio)

  bassFilter = context.createBiquadFilter()
  bassFilter.type = "lowshelf"
  bassFilter.frequency.value = 250

  midFilter = context.createBiquadFilter()
  midFilter.type = "peaking"
  midFilter.frequency.value = 1000
  midFilter.Q.value = 0.7

  trebleFilter = context.createBiquadFilter()
  trebleFilter.type = "highshelf"
  trebleFilter.frequency.value = 4000

  source.connect(bassFilter)
  bassFilter.connect(midFilter)
  midFilter.connect(trebleFilter)
  trebleFilter.connect(context.destination)
}

export function applyEqualizerSettings(settings: EqualizerSettings) {
  if (!bassFilter || !midFilter || !trebleFilter) return
  bassFilter.gain.value = settings.bass
  midFilter.gain.value = settings.mid
  trebleFilter.gain.value = settings.treble
}

// Les navigateurs créent l'AudioContext en état "suspended" tant qu'aucun
// geste utilisateur n'a eu lieu : à relancer à chaque lecture.
export function resumeEqualizerContext() {
  if (context?.state === "suspended") void context.resume()
}
