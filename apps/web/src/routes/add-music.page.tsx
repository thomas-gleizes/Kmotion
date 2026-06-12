import { useState, type FormEvent } from "react"
import { createRoute, Link } from "@tanstack/react-router"
import { css } from "styled-system/css"
import { appLayoutRoute } from "./app.layout"
import { useAddMusic } from "../api/queries"
import { extractMediaId } from "../lib/format"
import { Button } from "../components/Button"
import { TextField } from "../components/TextField"
import { pageHeading } from "../lib/styles"

const card = css({
  maxWidth: "560px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "28px",
  borderRadius: "l",
  backgroundColor: "surface",
  border: "1px solid token(colors.border)",
})

const helpStyle = css({ fontSize: "13px", color: "textSecondary", lineHeight: "1.5" })
const errorStyle = css({ fontSize: "13px", color: "danger" })
const successStyle = css({
  fontSize: "14px",
  color: "success",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  "& a": { color: "accent", fontWeight: "600" },
})

export const AddMusicPage = () => {
  const [url, setUrl] = useState("")
  const [formatError, setFormatError] = useState(false)
  const addMusic = useAddMusic()

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const mediaId = extractMediaId(url)
    if (!mediaId) {
      setFormatError(true)
      return
    }
    setFormatError(false)
    addMusic.mutate(mediaId, { onSuccess: () => setUrl("") })
  }

  return (
    <div>
      <h1 className={pageHeading}>Ajouter un titre</h1>
      <form className={card} onSubmit={onSubmit}>
        <TextField
          label="Lien YouTube"
          placeholder="https://www.youtube.com/watch?v=…"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <p className={helpStyle}>
          Collez un lien YouTube (watch, youtu.be, shorts) ou directement l’identifiant de la
          vidéo. Le titre est converti en MP3 puis ajouté à votre bibliothèque — la conversion
          peut prendre un moment.
        </p>
        {formatError && <div className={errorStyle}>Lien YouTube non reconnu.</div>}
        {addMusic.isError && (
          <div className={errorStyle}>L’ajout a échoué. Réessayez dans un instant.</div>
        )}
        {addMusic.isSuccess && (
          <div className={successStyle}>
            Titre ajouté à la bibliothèque !
            <Link to="/">
              Voir la bibliothèque
            </Link>
          </div>
        )}
        <Button type="submit" disabled={addMusic.isPending}>
          {addMusic.isPending ? "Conversion en cours…" : "Ajouter"}
        </Button>
      </form>
    </div>
  )
}

export const addMusicRoute = createRoute({
  path: "/add",
  component: AddMusicPage,
  getParentRoute: () => appLayoutRoute,
})
