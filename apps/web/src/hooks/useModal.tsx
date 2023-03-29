import React from "react"
import { v4 as uuid } from "uuid"

import { useModalContext } from "../contexts/modals"

export function useModal<Result = unknown>(): (
  component: React.ReactElement
) => Promise<Result> | Result {
  const { addModal } = useModalContext()

  return (component: React.ReactElement) =>
    new Promise<Result>((resolve) => addModal({ uid: uuid(), component, resolve }))
}
