import React, { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { FaAngleLeft, FaAngleRight, FaSync } from "react-icons/fa"
import { toast } from "react-toastify"
import { Link, useSearch } from "@tanstack/react-router"
import Hls from "hls.js"

import { IMusic } from "@kmotion/types"

import { api } from "../../utils/Api"
import { s } from "../../utils/helpers"
import ImageLoader from "../../components/common/ImageLoader"
import FallbackImage from "../../components/common/FallbackImage"

const AdminMusics: Page = () => {
  const offset = useSearch({ from: "/admin/musics", select: (search) => search.page })
  const row = useSearch({ from: "/admin/musics", select: (search) => search.row })
  const order = useSearch({ from: "/admin/musics", select: (search) => search.order })

  const [current, setCurrent] = useState<IMusic | null>(null)

  const musicsQuery = useQuery({
    queryKey: ["musics", { offset }],
    queryFn: () => api.fetchMusics(offset),
  })

  const syncMutation = useMutation({
    mutationKey: ["sync-musics"],
    mutationFn: () => api.synchronizeMusic(),
    onSuccess: async (resp) => {
      if (resp.musics.length === 0) return toast.info("Aucune nouvelle music")
      else
        toast.info(
          `${resp.musics.length} nouvelle${s(resp.musics.length)} music${s(
            resp.musics.length,
          )} synchronisé !`,
        )

      await musicsQuery.refetch()
    },
  })

  function formatDuration(duration: number) {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  const audioRef = React.useRef<HTMLAudioElement>(null)

  const handlePlay = async (music: IMusic) => {
    const audio = audioRef.current!

    const data = await api.hlsMusic(music.id)

    const src = data.url + "/index.m3u8"

    if (Hls.isSupported()) {
      console.log("ICI")
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(audio)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play()
      })
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("NULL")
      audio.src = src
      audio.addEventListener("loadedmetadata", () => {
        audio.play()
      })
    }

    setCurrent(music)
  }

  return (
    <div className="pb-24">
      <div className="pb-4">
        <h1 className="text-center text-3xl">Admin musics page</h1>
        <button
          className="bg-blue-800 text-white hover:bg-blue-900 disabled:bg-blue-600 shadow px-5 py-2 text-xl rounded flex items-center justify-center gap-5"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
        >
          Synchronize
          <i>
            <FaSync />
          </i>
        </button>
        {current && <div>{current.title}</div>}

        <audio ref={audioRef} />
      </div>
      {musicsQuery.isSuccess && (
        <table className="table-auto border bg-white rounded">
          <thead className="rounded shadow">
            <tr className="border-b text-xl font-semibold">
              <td className="px-3 py-4">
                <p>#ID</p>
              </td>
              <td className="px-3">
                <p>Titre</p>
              </td>
              <td className="px-3">
                <p>Artist</p>
              </td>
              <td className="px-3">
                <p>Youtube ID</p>
              </td>
              <td className="px-3">
                <p>Duration</p>
              </td>
              <td className="px-3">
                <p>Downloader</p>
              </td>
              <td className="px-3 text-center">
                <p>Asset</p>
              </td>
            </tr>
          </thead>
          <tbody className="overflow-y-visible">
            {musicsQuery.data.musics.map((music) => (
              <tr onClick={() => handlePlay(music)} key={music.id} className="border-b text-lg">
                <td className="px-3">
                  <p>{music.id}</p>
                </td>
                <td className="px-3">
                  <p>{music.title}</p>
                </td>
                <td className="px-3">
                  <p>{music.artist}</p>
                </td>
                <td className="px-3">
                  <a
                    className="underline text-blue-500 visited:black"
                    href={`https://youtube.com/watch?v=${music.youtubeId}`}
                  >
                    {music.youtubeId}
                  </a>
                </td>
                <td className="px-3 text-right">
                  <p>{formatDuration(music.duration)}</p>
                </td>
                <td className="px-3 text-right">
                  <p>{music.downloaderId}</p>
                </td>
                <td className="text-center px-3">
                  <div className="w-16 rounded overflow-hidden">
                    <ImageLoader id={music.id} fallback={<FallbackImage />}>
                      {({ src }) => <img alt={music.title} src={src} />}
                    </ImageLoader>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="py-2">
            <tr>
              <td className="text-center border py-2" colSpan={7}>
                <div>
                  <select>
                    <option></option>
                  </select>
                </div>
                <div className="flex justify-center items-center gap-4">
                  <Link to="/admin/musics" search={{ page: offset - 1, row, order }}>
                    <FaAngleLeft className="cursor-pointer" />
                  </Link>
                  <Link to="/admin/musics" search={{ page: offset + 1, row, order }}>
                    <FaAngleRight className="cursor-pointer" />
                  </Link>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}

export default AdminMusics
