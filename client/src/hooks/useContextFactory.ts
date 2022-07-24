import { Context, useContext } from "react";

export default function useContextFactory<T>(context: Context<T>) {
  return (): T => {
    const values = useContext(context);

    if (typeof values === "undefined") throw new Error("context must be in a context provider");

    return values;
  };
}
