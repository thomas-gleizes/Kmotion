import { useState } from "react"
import { type DialogComponent } from "react-dialog-promise"
import { css } from "styled-system/css"
import { Modal } from "../Modal"
import { PlaylistForm } from "../PlaylistForm"

type Values = {
  title: string
  description: string
  visibility: "public" | "private"
}

type Props = {
  heading: string
  submitLabel: string
  initial?: Values
  onSubmit: (values: Values) => Promise<unknown>
}

const errorStyle = css({ color: "danger", fontSize: "13px", marginTop: "12px" })

export const PlaylistFormDialog: DialogComponent<Props, boolean> = ({
  isOpen,
  close,
  heading,
  submitLabel,
  initial,
  onSubmit,
}) => {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (values: Values) => {
    setPending(true)
    setError(false)
    try {
      await onSubmit(values)
      close(true)
    } catch {
      setError(true)
      setPending(false)
    }
  }

  return (
    <Modal title={heading} open={isOpen} onClose={() => close(false)}>
      <PlaylistForm
        initial={initial}
        pending={pending}
        submitLabel={submitLabel}
        onSubmit={handleSubmit}
      />
      {error && <div className={errorStyle}>L’enregistrement a échoué. Réessayez.</div>}
    </Modal>
  )
}
