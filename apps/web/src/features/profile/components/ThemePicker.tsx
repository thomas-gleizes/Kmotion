import { cx } from "styled-system/css"
import { CheckIcon } from "@/shared/ui/icons"
import { useTheme } from "@/shared/theme/ThemeContext"
import { themes } from "@/shared/theme/themes"
import {
  themeCard,
  themeCardActive,
  themeDescription,
  themeGrid,
  themeLabelRow,
  themePreview,
  themeSwatch,
} from "@/features/profile/profile.styles"

// Sélecteur de thème : chaque carte montre un aperçu des couleurs et applique
// le thème via le ThemeContext.
export function ThemePicker() {
  const { theme, setTheme } = useTheme()

  return (
    <div className={themeGrid}>
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          className={cx(themeCard, theme === t.id && themeCardActive)}
          onClick={() => setTheme(t.id)}
          aria-pressed={theme === t.id}
        >
          <div className={themePreview} style={{ backgroundColor: t.preview.bg }}>
            <span className={themeSwatch} style={{ backgroundColor: t.preview.surface }} />
            <span className={themeSwatch} style={{ backgroundColor: t.preview.accent }} />
          </div>
          <div className={themeLabelRow}>
            {t.label}
            {theme === t.id && <CheckIcon size={16} />}
          </div>
          <div className={themeDescription}>{t.description}</div>
        </button>
      ))}
    </div>
  )
}
