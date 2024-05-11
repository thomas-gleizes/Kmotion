import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/Api"
import { toast } from "react-toastify"
import { FaCheck, FaTimes } from "react-icons/fa"
import React from "react"

const UserList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["users", "users-lists"],
    queryFn: () => api.fetchUsers().then((resp) => resp.users),
    placeholderData: [],
  })

  const activateMutation = useMutation({
    mutationKey: ["users", "activate-user"],
    mutationFn: (id: number) => api.activateUser(id),
    onSuccess: () => {
      toast.info("Utilisateur activé")
      refetch()
    },
  })

  const deactivateMutation = useMutation({
    mutationKey: ["users", "deactivate-user"],
    mutationFn: (id: number) => api.deactivateUser(id),
    onSuccess: () => {
      toast.info("Utilisateur désactivé")
      refetch()
    },
  })

  const disableAction = deactivateMutation.isPending || activateMutation.isPending

  if (isLoading) return <div>Loading...</div>

  if (isSuccess)
    return (
      <table>
        <thead>
          <tr>
            <th className="px-2">Id</th>
            <th className="px-2">Name</th>
            <th className="px-2">Email</th>
            <th className="px-2">Visibility</th>
            <th className="px-2">Activé</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-1 py-0.5">#{user.id}</td>
              <td className="px-2">{user.name}</td>
              <td className="px-2">{user.email}</td>
              <td className="px-2">{user.visibility}</td>
              <td className="px-2">
                <div className="flex">
                  {user.isActivate ? (
                    !user.isAdmin && (
                      <button
                        disabled={disableAction}
                        onClick={() => deactivateMutation.mutate(user.id)}
                        className="border-2 border-red-800 text-red-700 text-lg rounded p-1.5 scale-90 hover:scale-100"
                      >
                        <FaTimes />
                      </button>
                    )
                  ) : (
                    <button
                      disabled={disableAction}
                      onClick={() => activateMutation.mutate(user.id)}
                      className="border-2 border-green-800 text-green-700 text-lg rounded p-1.5 scale-90 hover:scale-100"
                    >
                      <FaCheck />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )

  return <div>Error</div>
}

export default UserList
