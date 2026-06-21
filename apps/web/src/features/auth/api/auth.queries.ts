import { queryOptions } from "@tanstack/react-query"
import { api } from "@/shared/api/client"
import { keys, unwrap } from "@/shared/api/query-keys"

export const meQuery = queryOptions({
  queryKey: keys.me,
  queryFn: async () => unwrap(await api.GET("/api/3.1/users/me")),
})
