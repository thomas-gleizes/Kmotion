export type ThemeId = "dark" | "light" | "spotify" | "ocean"

export type ThemeDefinition = {
  id: ThemeId
  label: string
  description: string
  preview: { bg: string; surface: string; accent: string; text: string }
}

export const themes: ThemeDefinition[] = [
  {
    id: "dark",
    label: "Sombre",
    description: "Le thème par défaut, sombre et élégant.",
    preview: { bg: "#0a0a0c", surface: "#1c1c1e", accent: "#fa2d48", text: "#ffffff" },
  },
  {
    id: "light",
    label: "Clair",
    description: "Un thème lumineux pour la journée.",
    preview: { bg: "#f5f5f7", surface: "#ffffff", accent: "#fa2d48", text: "#1c1c1e" },
  },
  {
    id: "spotify",
    label: "Spotify",
    description: "Inspiré du vert emblématique de Spotify.",
    preview: { bg: "#121212", surface: "#181818", accent: "#1db954", text: "#ffffff" },
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Un bleu profond inspiré des réseaux sociaux.",
    preview: { bg: "#0f1620", surface: "#16212e", accent: "#1d9bf0", text: "#ffffff" },
  },
]

export const defaultTheme: ThemeId = "dark"

export const themeIds = themes.map((theme) => theme.id)

export function isThemeId(value: string): value is ThemeId {
  return (themeIds as string[]).includes(value)
}
