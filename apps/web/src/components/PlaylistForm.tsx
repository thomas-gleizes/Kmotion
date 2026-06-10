import { useState, type FormEvent } from "react"
import { css } from "styled-system/css"
import { Button } from "./Button"
import { TextField, TextArea } from "./TextField"

const formStyle = css({ display: "flex", flexDirection: "column", gap: "16px" })

const visibilityRow = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "14px",
  color: "textSecondary",
})

type Values = {
  title: string
  description: string
  visibility: "public" | "private"
}

type Props = {
  initial?: Values
  pending: boolean
  submitLabel: string
  onSubmit: (values: Values) => void
}

export function PlaylistForm({ initial, pending, submitLabel, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [isPublic, setIsPublic] = useState(initial?.visibility === "public")

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit({ title, description, visibility: isPublic ? "public" : "private" })
  }

  return (
    <form className={formStyle} onSubmit={submit}>
      <TextField
        label="Titre"
        required
        minLength={3}
        maxLength={50}
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <TextArea
        label="Description"
        maxLength={255}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <label className={visibilityRow}>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(event) => setIsPublic(event.target.checked)}
        />
        Playlist publique
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement…" : submitLabel}
      </Button>
    </form>
  )
}
