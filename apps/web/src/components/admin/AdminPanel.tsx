import React, { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { api } from "../../utils/Api"
import { toast } from "react-toastify"
import { s } from "../../utils/helpers"
import { FaCheck, FaTimes } from "react-icons/fa"

const AdminPanel: Component = () => {
  const syncMutation = useMutation({
    mutationKey: ["sync-musics"],
    mutationFn: () => api.synchronizeMusic(),
    onSuccess: (resp) => {
      toast.info(
        `${resp.musics.length} nouvelle${s(resp.musics.length)} music${s(
          resp.musics.length,
        )} synchronisé !`,
      )
    },
  })

  return (
    <div className="border rounded w-fit">
      <div className="border-b px-10 py-1 text-xl">Admin panel</div>
      <div className="px-5 py-3">
        <UserList />
      </div>
      <div className="px-1 py-1 flex justify-end border-t">
        <button
          className="btn bg-blue-800 text-white hover:bg-blue-900 disabled:bg-blue-600"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isLoading}
        >
          sync musics
        </button>
      </div>
    </div>
  )
}

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

  const disableAction = deactivateMutation.isLoading || activateMutation.isLoading

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

export default AdminPanel
