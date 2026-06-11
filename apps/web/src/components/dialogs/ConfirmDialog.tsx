import { type DialogComponent } from "react-dialog-promise"
import { css } from "styled-system/css"
import { Modal } from "../Modal"
import { Button } from "../Button"

type Props = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

const message = css({ color: "textSecondary", fontSize: "14px", marginBottom: "20px" })
const actions = css({ display: "flex", gap: "10px", justifyContent: "flex-end" })

export const ConfirmDialog: DialogComponent<Props, boolean> = ({
  isOpen,
  close,
  title,
  message: text,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = false,
}) => (
  <Modal title={title} open={isOpen} onClose={() => close(false)}>
    <p className={message}>{text}</p>
    <div className={actions}>
      <Button variant="ghost" onClick={() => close(false)}>
        {cancelLabel}
      </Button>
      <Button variant={danger ? "danger" : "primary"} onClick={() => close(true)}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
)
