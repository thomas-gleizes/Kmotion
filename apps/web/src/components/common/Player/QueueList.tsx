import React, { useMemo } from "react"
import { useDialog } from "react-dialog-promise"
import { CgRowFirst, FaList, FaTimes, FaTrash } from "react-icons/all"

import { IMusic } from "@kmotion/types"
import { usePlayerContext } from "../../../contexts/player"
import { useAuthenticatedContext } from "../../../contexts/auth"
import { MusicsList } from "../Music/List"
import AddToPlaylist from "../../modals/AddToPlaylist"
import EditPlaylist from "../../modals/EditPlaylist"

const QueueList: Component = () => {
  const { actions, queue } = usePlayerContext()
  const { user } = useAuthenticatedContext()

  const nextMusics = useMemo(() => {
    const nextMusics = [...queue]
    nextMusics.splice(0, 1)
    return nextMusics.slice(0, 50)
  }, [queue])

  const addToPlaylist = useDialog(AddToPlaylist)
  const editPlaylist = useDialog(EditPlaylist)

  const handleAddToPlaylist = async (music: IMusic) => {
    const result = await addToPlaylist.open({ music })

    if (result === "create-playlist") {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const result = await editPlaylist.open({
        isNew: true,
        musics: [],
        initialValues: { title: "", description: "", musics: [] },
      })

      await new Promise((resolve) => setTimeout(resolve, 500))
      if (result.action === "success-new") {
        await handleAddToPlaylist(music)
      }
    }
  }

  const listActions = useMemo(() => {
    const listActions = [
      [
        {
          label: "Supprimer de la queue",
          icon: <FaTimes />,
          className: "text-primary hover:bg-primary/30",
          onClick: (music: IMusic) => null,
        },
        {
          label: "Ajouter à une playlist",
          icon: <FaList />,
          className: "hover:bg-white/30",
          onClick: handleAddToPlaylist,
        },
      ],
      [
        {
          label: "Lire ensuite",
          icon: <CgRowFirst />,
          className: "text-white/80 hover:bg-white/30",
          onClick: (music: IMusic) => actions.addNext(music),
        },
        {
          label: "Lire en dernier",
          icon: <CgRowFirst />,
          className: "text-white/80 hover:bg-white/30",
          onClick: (music: IMusic) => {
            actions.addNext(music)
          },
        },
      ],
    ]

    if (user.isAdmin) {
      listActions[0].unshift({
        label: "Supprimer",
        icon: <FaTrash />,
        className: "text-primary hover:bg-primary/30",
        onClick: (music: IMusic) => null,
      })
    }

    return listActions
  }, [user])

  return (
    <MusicsList
      musics={nextMusics}
      loading={false}
      onClick={(_, index) => actions.go(index + 1)}
      actions={listActions}
    />
  )
}

export default QueueList
