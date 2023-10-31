import React, { useMemo, useRef } from "react"
import { useDialog } from "react-dialog-promise"
import { FaDownload, FaList, FaShare, FaTrash, FaYoutube } from "react-icons/fa"
import classnames from "classnames"

import { IMusic } from "@kmotion/types"
import { api } from "../../../utils/Api"
import { useAuthenticatedContext } from "../../../contexts/auth"
import { usePlayerContext } from "../../../contexts/player"
import { MusicItemActions } from "../Music/List"
import AddToPlaylist from "../../modals/AddToPlaylist"
import EditPlaylist from "../../modals/EditPlaylist"
import ConfirmDialog from "../../modals/ConfirmDialog"
import SharedMusic from "../../modals/SharedMusic"

interface Props {
  music: IMusic
}

const TitlePlayer: Component<Props> = ({ music }) => {
  const { user } = useAuthenticatedContext()
  const { actions } = usePlayerContext()

  const tRef = useRef<HTMLHeadingElement>(null)

  const addToPlaylist = useDialog(AddToPlaylist)
  const editPlaylist = useDialog(EditPlaylist)
  const confirmDialog = useDialog(ConfirmDialog)
  const shareDialog = useDialog(SharedMusic)

  const handleAddToPlaylist = async () => {
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
        await handleAddToPlaylist()
      }
    }
  }

  const handleShare = async () => {
    const response = await api.shareMusic(music.id)
    const result = await shareDialog.open({ link: response.link })

    result.copy && navigator.clipboard.writeText(response.link)
  }

  const handleDelete = () =>
    confirmDialog
      .open({
        message: (
          <span>
            Voulez vous supprimer la music "{music.title}" de {music.artist} <br /> Cette action est
            définitive
          </span>
        ),
      })
      .then((result) => {
        if (result)
          api
            .deleteMusic(music.id)
            .then(() => actions.remove(actions.findIndex(music)))
            .catch((err) => console.log("delete failed", err))
      })

  const listActions = useMemo(() => {
    const listActions = [
      [
        {
          label: "Ajouter à une playlist",
          icon: <FaList />,
          className: "hover:bg-white/30",
          onClick: handleAddToPlaylist,
        },
        {
          label: "Ouvrir sur Youtube",
          icon: <FaYoutube />,
          className: "hover:bg-white/30",
          onClick: () => window.open(`https://youtube.com/watch?v=${music.youtubeId}`, "_blank"),
        },
        {
          label: "Télécharger",
          icon: <FaDownload />,
          className: "hover:bg-white/30",
          onClick: () => {
            const link = document.createElement("a")
            link.href = music.links.stream
            link.setAttribute("download", music.title)
            link.click()
          },
        },
      ],
    ]

    if (user.isAdmin) {
      listActions[0].push(
        {
          label: "Partager",
          icon: <FaShare />,
          className: "text-white/90 hover:bg-white/20",
          onClick: handleShare,
        },
        {
          label: "Supprimer",
          icon: <FaTrash />,
          className: "text-primary hover:bg-primary/30",
          onClick: handleDelete,
        },
      )
    }

    return listActions
  }, [user])

  const isOverflow =
    (tRef.current?.offsetWidth || 0) >= (tRef.current?.parentElement?.offsetWidth || 2000)

  return (
    <div className="flex justify-between items-center">
      <div className="w-full overflow-hidden whitespace-nowrap">
        <h3
          ref={tRef}
          className={classnames(
            "text-white text-lg lg:text-xl xl:text-3xl font-semibold capitalize py-1.5 inline-block whitespace-nowrap",
            { "overflow-defilement": isOverflow },
          )}
        >
          {music.title}
        </h3>
        <p className="text-white/80 text-base lg:text-lg xl:text-xl py-1.5 leading-[0.5rem]">
          {music.artist}
        </p>
      </div>
      <div>
        <MusicItemActions actions={listActions} music={music} />
      </div>
    </div>
  )
}

export default TitlePlayer
