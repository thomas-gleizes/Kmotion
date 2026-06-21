import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/shared/api/client"
import { keys, unwrap } from "@/shared/api/query-keys"

export const usersQuery = (page: number, size: number) =>
  queryOptions({
    queryKey: keys.users(page, size),
    queryFn: async () =>
      unwrap(await api.GET("/api/3.1/users", { params: { query: { page, size } } })),
  })

export function useBanUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) =>
      unwrap(
        await api.POST("/api/3.1/users/{id}/ban", {
          params: { path: { id } },
          parseAs: "text",
        }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}

export function useUnbanUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) =>
      unwrap(
        await api.POST("/api/3.1/users/{id}/unban", {
          params: { path: { id } },
          parseAs: "text",
        }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) =>
      unwrap(
        await api.DELETE("/api/3.1/users/{id}", {
          params: { path: { id } },
          parseAs: "text",
        }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}
