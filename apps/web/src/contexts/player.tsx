import { createContext, useEffect, useState } from "react"
import useLocalStorageState from "use-local-storage-state"
import { useToggle } from "react-use"

import { IMusic, IPlaylist } from "@kmotion/types"
import { LoopType, PlayerContextValues } from "../../types/contexts"
import { useContextFactory, useImageLoader, useStorageQueue, useStreamLoader } from "../hooks"
import { getImageResolution, isIos, resizeImage } from "../utils/helpers"
import { LOCAL_STORAGE_KEYS } from "../utils/constants"

const PlayerContext = createContext<PlayerContextValues>(null as never)

export const usePlayerContext = useContextFactory(PlayerContext)

const defaultPlay = localStorage.getItem(LOCAL_STORAGE_KEYS.DEFAULT_PLAYING) === "yes"

const PlayerProvider: ComponentWithChild = ({ children }) => {
  const [loop, setLoop] = useLocalStorageState<LoopType>("loop", { defaultValue: "none" })
  const [musicsHistory, setMusicsHistory] = useLocalStorageState<IMusic[]>("musics-history", {
    defaultValue: [],
  })
  const [playing, togglePlaying] = useToggle(defaultPlay)

  const [isPictureInPicture, togglePictureInPicture] = useToggle(false)
  const [isFullscreen, toggleFullscreen] = useToggle(false)

  const [currentPlaylist, setCurrentPlaylist] = useState<IPlaylist | null>(null)

  const { queue, actions, isShuffled } = useStorageQueue<IMusic>()

  const currentMusic = queue.at(0) || null
  const nexMusic = queue.at(1) || null
  const prevMusic = queue.at(-1) || null

  const [streamUrl, streamQuery] = useStreamLoader(currentMusic?.id, {
    enabled: currentMusic !== null,
  })
  const [coverUrl, coverQuery] = useImageLoader(currentMusic?.id)

  useImageLoader(nexMusic?.id)
  const [, nextStreamQuery] = useStreamLoader(nexMusic?.id, { enabled: currentMusic !== null })

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEFAULT_PLAYING, playing ? "yes" : "no")
  }, [playing])

  useEffect(() => {
    if (currentMusic)
      setMusicsHistory((state) =>
        state.at(-1)?.id === currentMusic.id ? state : [...state, currentMusic],
      )
  }, [currentMusic])

  useEffect(() => {
    if ("mediaSession" in navigator && coverUrl && currentMusic) {
      ;(async () => {
        const resolution = await getImageResolution(coverUrl)

        const imageResized = await resizeImage(coverUrl, 336, 188).then((blob) =>
          URL.createObjectURL(blob),
        )
        const resolutionResised = await getImageResolution(imageResized)

        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentMusic.title,
          artist: currentMusic.artist || "Unknown",
          artwork: [
            {
              src: imageResized,
              sizes: `${resolutionResised.width}x${resolutionResised.height}`,
              type: "image/jpeg",
            },
            {
              src: coverUrl,
              sizes: `${resolution.width}x${resolution.height}`,
              type: "image/jpeg",
            },
            { src: imageResized, sizes: `512x512`, type: "image/jpeg" },
          ],
        })

        if (isPictureInPicture) {
          void handlePictureInPicture()
        }
      })()
    }
  }, [currentMusic, coverUrl])

  useEffect(() => {
    if ("mediaSession" in navigator && currentMusic) {
      if (isIos()) {
        if (prevMusic) {
          navigator.mediaSession.setActionHandler("previoustrack", () => actions.previous())
        }

        if (nexMusic) navigator.mediaSession.setActionHandler("nexttrack", () => actions.next())
      } else {
        navigator.mediaSession.setActionHandler("previoustrack", () => actions.previous())
        navigator.mediaSession.setActionHandler("nexttrack", () => actions.next())
      }

      navigator.mediaSession.setActionHandler("play", () => togglePlaying(true))
      navigator.mediaSession.setActionHandler("pause", () => togglePlaying(false))
      navigator.mediaSession.setActionHandler("stop", () => togglePlaying(false))
    }
  }, [prevMusic, nexMusic, currentMusic])

  const handlePictureInPicture = async () => {
    if (!navigator.mediaSession.metadata) return

    const artwork = navigator.mediaSession.metadata.artwork.at(1)
    if (!artwork) return

    const canvas = document.createElement("canvas")

    if (!artwork.sizes) [canvas.width, canvas.height] = [426, 240]
    else [canvas.width, canvas.height] = artwork.sizes!.split("x").map((size) => +size)

    const video = document.createElement("video")
    video.srcObject = canvas.captureStream()
    video.muted = true
    video.style.display = "none"

    const image = new Image()
    image.crossOrigin = String(true)
    image.src = artwork.src
    await image.decode()

    canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height)

    document.body.append(video)

    await video.play()
    await video.requestPictureInPicture()

    video.addEventListener("leavepictureinpicture", () => {
      togglePictureInPicture(false)
      video.remove()
    })

    togglePictureInPicture(true)
  }

  const handleClosePictureInPicture = () => {
    if (document.pictureInPictureElement) {
      void document.exitPictureInPicture()
    }
  }

  const clearPlayer = () => {
    setCurrentPlaylist(null)
    actions.clear()
    toggleFullscreen(false)
    togglePictureInPicture(false)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentMusic,
        playlist: { value: currentPlaylist, set: (value) => setCurrentPlaylist(value) },
        assets: {
          cover: { url: coverUrl || "", isFetching: coverQuery.isFetching },
          stream: { url: streamUrl || "", isFetching: streamQuery.isFetching },
          next: { isFetching: nextStreamQuery.isFetching },
        },
        history: musicsHistory,
        queue,
        actions,
        loop: { value: loop, set: setLoop },
        fullscreen: { value: isFullscreen, toggle: toggleFullscreen },
        playing: { value: playing, toggle: togglePlaying },
        isShuffled,
        pictureInPicture: {
          value: isPictureInPicture,
          toggle: isPictureInPicture ? handleClosePictureInPicture : handlePictureInPicture,
        },
        clear: clearPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider
