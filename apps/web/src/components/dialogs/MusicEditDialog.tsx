import { useState, type FormEvent } from "react"
import { type DialogComponent } from "react-dialog-promise"
import { css } from "styled-system/css"
import { useUpdateMusic, type Music } from "../../api/queries"
import { Modal } from "../Modal"
import { Button } from "../Button"
import { TextField } from "../TextField"

const form = css({ display: "flex", flexDirection: "column", gap: "16px" })
const actions = css({ display: "flex", gap: "10px", justifyContent: "flex-end" })
const errorStyle = css({ color: "danger", fontSize: "13px" })

export const MusicEditDialog: DialogComponent<{ music: Music }, boolean> = ({
  isOpen,
  close,
  music,
}) => {
  const updateMusic = useUpdateMusic()
  const [title, setTitle] = useState(music.title)
  const [artist, setArtist] = useState(music.artist)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    updateMusic.mutate(
      { id: music.id, body: { title: title.trim(), artist: artist.trim() } },
      { onSuccess: () => close(true) },
    )
  }

  return (
    <Modal title="Modifier le titre" open={isOpen} onClose={() => close(false)}>
      <form className={form} onSubmit={onSubmit}>
        <TextField
          label="Titre"
          required
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          label="Artiste"
          required
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
        />
        {updateMusic.isError && (
          <div className={errorStyle}>La mise à jour a échoué. Réessayez.</div>
        )}
        <div className={actions}>
          <Button type="button" variant="ghost" onClick={() => close(false)}>
            Annuler
          </Button>
          <Button type="submit" disabled={updateMusic.isPending || !title.trim() || !artist.trim()}>
            {updateMusic.isPending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
