import { create } from "zustand"
import { isMobileOrTablet } from "../utils/helpers"

export const useLayoutStore = create(() => ({
  isMobile: isMobileOrTablet(),
}))
