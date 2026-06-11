import React, { useCallback, useEffect, useState } from "react"
import { FiCheck, FiDownload, FiLoader, FiAlertCircle, FiYoutube } from "react-icons/fi"
import { api, type Music } from "../../utils/api"
import { useVideoStore } from "../../stores"
import { POLL_INTERVAL_MS } from "../../utils/constants"
import { formatDuration } from "../../utils/format"
import { Thumbnail } from "../Thumbnail"
import { EmptyState } from "../EmptyState"
import { Loader } from "../Loader"
import { Button } from "../Button"
import { Banner } from "../Banner"

type Status = "checking" | "not-found" | "in-progress" | "converted" | "error"

// Backend errors that actually mean "a conversion is already running".
function isInProgressError(message: string): boolean {
  const m = message.toLowerCase()
  return m.includes("downloading") || m.includes("already downloaded")
}

export const VideoTab: React.FC = () => {
  const videoId = useVideoStore((state) => state.videoId)
  const isYoutube = useVideoStore((state) => state.isYoutube)

  const [status, setStatus] = useState<Status>("checking")
  const [music, setMusic] = useState<Music | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const lookup = useCallback(async (id: string): Promise<Status> => {
    const result = await api.getMusicByYoutubeId(id)
    if (result.status === "not-found") {
      setMusic(null)
      return "not-found"
    }
    setMusic(result.music)
    return result.music.converted ? "converted" : "in-progress"
  }, [])

  // Initial lookup whenever the detected video changes.
  useEffect(() => {
    if (!videoId) {
      setStatus("checking")
      return
    }
    let active = true
    setStatus("checking")
    setErrorMsg(null)
    lookup(videoId)
      .then((next) => active && setStatus(next))
      .catch(() => {
        if (active) {
          setErrorMsg("Impossible de récupérer la vidéo")
          setStatus("error")
        }
      })
    return () => {
      active = false
    }
  }, [videoId, lookup])

  // Poll while a conversion is in progress; the effect's cleanup stops it.
  useEffect(() => {
    if (status !== "in-progress" || !videoId) return
    const id = setInterval(() => {
      lookup(videoId)
        .then((next) => next === "converted" && setStatus("converted"))
        .catch(() => {
          /* keep polling; transient errors are expected during conversion */
        })
    }, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [status, videoId, lookup])

  const handleConvert = async () => {
    if (!videoId) return
    setErrorMsg(null)
    setStatus("in-progress")
    try {
      await api.createMusicFromYoutube(videoId)
    } catch (err) {
      const message = err instanceof Error ? err.message : ""
      if (!isInProgressError(message)) {
        setErrorMsg(message || "La conversion a échoué")
        setStatus("error")
      }
      // Otherwise a conversion is already running → stay in "in-progress".
    }
  }

  if (!isYoutube) {
    return (
      <EmptyState
        icon={<FiYoutube size={40} />}
        title="Aucune vidéo YouTube"
        message="Ouvrez une vidéo YouTube pour la convertir en musique."
      />
    )
  }

  if (!videoId) {
    return (
      <EmptyState
        icon={<FiYoutube size={40} />}
        title="Pas sur une vidéo"
        message="Naviguez vers une page de lecture YouTube (youtube.com/watch)."
      />
    )
  }

  if (status === "checking") {
    return <Loader text="Vérification…" />
  }

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-m overflow-hidden bg-surface-raised border border-hairline shadow-card">
        {status === "converted" && music ? (
          <Thumbnail musicId={music.id} className="w-full h-[150px]" />
        ) : (
          <img
            src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
            alt=""
            className="w-full h-[150px] object-cover"
          />
        )}
      </div>

      {music && (
        <div>
          <h2 className="font-semibold text-sm text-ink line-clamp-2 leading-snug">
            {music.title}
          </h2>
          <p className="text-xs text-ink-secondary mt-1">
            {music.artist}
            {music.duration ? ` · ${formatDuration(music.duration)}` : ""}
          </p>
        </div>
      )}

      {status === "converted" && (
        <Banner variant="success" icon={<FiCheck />}>
          Cette vidéo est déjà convertie.
        </Banner>
      )}

      {status === "in-progress" && (
        <Banner variant="warning" icon={<FiLoader className="animate-spin" />}>
          Conversion en cours…
        </Banner>
      )}

      {status === "not-found" && (
        <Button onClick={handleConvert} className="w-full py-2.5">
          <FiDownload size={16} />
          Convertir
        </Button>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <Banner variant="error" icon={<FiAlertCircle />}>
            {errorMsg ?? "Une erreur est survenue."}
          </Banner>
          <Button onClick={handleConvert} className="w-full py-2.5">
            Réessayer
          </Button>
        </div>
      )}
    </div>
  )
}
