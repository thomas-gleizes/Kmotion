import { useState } from "react";

export default function useToggle(initialValues: boolean = false): [boolean, () => void] {
  const [state, setState] = useState<boolean>(initialValues);

  const toggle = () => setState(!state);

  return [state, toggle];
}
