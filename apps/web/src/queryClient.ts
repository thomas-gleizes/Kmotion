import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Évite de refetch toute la bibliothèque à chaque retour sur une page
      staleTime: 60_000,
    },
  },
})
