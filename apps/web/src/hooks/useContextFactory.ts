import React, { useContext } from "react"

export function useContextFactory<T = unknown>(context: React.Context<T>) {
  return () => {
    const values = useContext<T>(context)

    if (values === undefined)
      throw new Error(`use{name}Context must be used withing a {name}ContextProvider.`)

    return values
  }
}
