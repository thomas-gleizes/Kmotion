import { Button } from "@/shared/ui/Button"
import {
  EQ_MAX_DB,
  EQ_MIN_DB,
  useEqualizerStore,
  type EqualizerBand,
} from "@/features/player/state/equalizerStore"
import {
  equalizerCard,
  eqLabelRow,
  eqReset,
  eqRow,
  eqSlider,
  eqValue,
} from "@/features/profile/profile.styles"

const eqBands: { id: EqualizerBand; label: string }[] = [
  { id: "bass", label: "Basses" },
  { id: "mid", label: "Médiums" },
  { id: "treble", label: "Aigus" },
]

// Réglage de l'égaliseur (basses / médiums / aigus) appliqué en direct via le
// store Zustand partagé avec le lecteur.
export function EqualizerSettings() {
  const eqSettings = useEqualizerStore((s) => s.settings)
  const setEqBand = useEqualizerStore((s) => s.setBand)
  const resetEq = useEqualizerStore((s) => s.reset)

  return (
    <div className={equalizerCard}>
      {eqBands.map((band) => (
        <div key={band.id} className={eqRow}>
          <div className={eqLabelRow}>
            <span>{band.label}</span>
            <span className={eqValue}>
              {eqSettings[band.id] > 0 ? "+" : ""}
              {eqSettings[band.id]} dB
            </span>
          </div>
          <input
            type="range"
            className={eqSlider}
            min={EQ_MIN_DB}
            max={EQ_MAX_DB}
            step={1}
            value={eqSettings[band.id]}
            onChange={(e) => setEqBand(band.id, Number(e.target.value))}
          />
        </div>
      ))}
      <Button variant="ghost" className={eqReset} onClick={resetEq}>
        Réinitialiser
      </Button>
    </div>
  )
}
