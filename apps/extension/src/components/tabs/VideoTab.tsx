import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FiCheck, FiDownload, FiLoader, FiAlertCircle, FiYoutube } from "react-icons/fi"
import { api, type MediaPreview, type Music } from "../../utils/api"
import { useVideoStore } from "../../stores"
import { POLL_INTERVAL_MS } from "../../utils/constants"
import { formatDuration } from "../../utils/format"
import { Thumbnail } from "../Thumbnail"
import { EmptyState } from "../EmptyState"
import { Loader } from "../Loader"
import { Button } from "../Button"
import { Banner } from "../Banner"
import { ClipEditor } from "../ClipEditor"
import { fullClipInput, resolveClipInput, type ClipInput } from "../../utils/clip"

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
  // Converter's view of a video not in the library yet (title, duration, limit).
  const [preview, setPreview] = useState<MediaPreview | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [clipInput, setClipInput] = useState<ClipInput>({ start: "", end: "" })

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
    setPreview(null)
    setPreviewError(null)
    lookup(videoId)
      .then((next) => {
        if (!active) return
        setStatus(next)
        // Only unknown videos need the (slower, converter-side) preview.
        if (next !== "not-found") return
        api
          .previewYoutube(videoId)
          .then((data) => {
            if (!active) return
            setPreview(data)
            if (data.duration !== null) setClipInput(fullClipInput(data.duration))
          })
          .catch((err) => {
            if (active) setPreviewError(err instanceof Error ? err.message : null)
          })
      })
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

  const total = preview?.duration ?? null
  const resolvedClip = useMemo(
    () => (total === null ? null : resolveClipInput(clipInput, total)),
    [clipInput, total],
  )
  const tooLong = !!preview && !!resolvedClip?.ok && resolvedClip.duration > preview.maxDuration
  // Without a preview the server still validates: let the user try anyway.
  const canConvert = !preview || (total !== null && !!resolvedClip?.ok && !tooLong)

  const handleConvert = async () => {
    if (!videoId || !canConvert) return
    setErrorMsg(null)
    setStatus("in-progress")
    try {
      await api.createMusicFromYoutube(videoId, resolvedClip?.ok ? resolvedClip.clip : undefined)
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
            src={preview?.thumbnailUrl ?? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
            alt=""
            className="w-full h-[150px] object-cover"
          />
        )}
      </div>

      {music ? (
        <div>
          <h2 className="font-semibold text-sm text-ink line-clamp-2 leading-snug">
            {music.title}
          </h2>
          <p className="text-xs text-ink-secondary mt-1">
            {music.artist}
            {music.duration ? ` · ${formatDuration(music.duration)}` : ""}
          </p>
        </div>
      ) : (
        preview && (
          <div>
            <h2 className="font-semibold text-sm text-ink line-clamp-2 leading-snug">
              {preview.title}
            </h2>
            <p className="text-xs text-ink-secondary mt-1">
              {preview.channel}
              {preview.duration !== null ? ` · ${formatDuration(preview.duration)}` : ""}
            </p>
          </div>
        )
      )}

      {(status === "not-found" || status === "error") && (
        <>
          {!preview && !previewError && <Loader text="Chargement des informations…" />}

          {previewError && (
            <p className="text-xs text-ink-tertiary">
              Détails indisponibles ({previewError}) : la vidéo sera convertie en entier.
            </p>
          )}

          {preview && total === null && (
            <Banner variant="warning" icon={<FiAlertCircle />}>
              Durée inconnue (direct ?) : cette vidéo ne peut pas être convertie.
            </Banner>
          )}

          {total !== null && resolvedClip && (
            <ClipEditor
              total={total}
              value={clipInput}
              resolved={resolvedClip}
              onChange={setClipInput}
            />
          )}

          {tooLong && preview && (
            <Banner variant="warning" icon={<FiAlertCircle />}>
              Trop long : {formatDuration(preview.maxDuration)} maximum. Coupez la vidéo pour la
              convertir.
            </Banner>
          )}
        </>
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
        <Button onClick={handleConvert} disabled={!canConvert} className="w-full py-2.5">
          <FiDownload size={16} />
          {resolvedClip?.ok && resolvedClip.clip ? "Convertir l'extrait" : "Convertir"}
        </Button>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <Banner variant="error" icon={<FiAlertCircle />}>
            {errorMsg ?? "Une erreur est survenue."}
          </Banner>
          <Button onClick={handleConvert} disabled={!canConvert} className="w-full py-2.5">
            Réessayer
          </Button>
        </div>
      )}
    </div>
  )
}
