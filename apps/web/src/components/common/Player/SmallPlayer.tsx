import React, { useEffect, useRef } from "react"
import classnames from "classnames"
import { useAudio, useEvent, useMount, useTitle } from "react-use"
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa"

import { usePlayerContext } from "../../../contexts/player"
import { useLayoutContext } from "../../../contexts/layout"
import { LOCAL_STORAGE_KEYS } from "../../../utils/constants"
import { handleStopPropagation, isIos } from "../../../utils/helpers"
import { roundMinMax } from "../../../utils/number"
import FullscreenPlayer from "./FullscreenPlayer"

const defaultPlay = localStorage.getItem(LOCAL_STORAGE_KEYS.DEFAULT_PLAYING) !== "false"

const SmallPlayer: Component = () => {
  const { currentMusic, queue, actions, loop, fullscreen, assets } = usePlayerContext()
  const { isLaggedBlur } = useLayoutContext()

  const [audio, state, controls, ref] = useAudio(
    <audio src={assets.stream.url} autoPlay={defaultPlay} />,
  )

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEFAULT_PLAYING, state.playing ? "true" : "false")
  }, [state.playing])

  const togglePlaying = () => (state.playing ? controls.pause() : controls.play())

  useEvent("keydown", (event) => {
    if (!["INPUT", "TEXTAREA"].includes(event.target.tagName))
      switch (event.key) {
        case " ":
          return togglePlaying()
        case "ArrowLeft":
          return controls.seek(state.time - 10)
        case "ArrowRight":
          return controls.seek(state.time + 10)
        case "ArrowUp":
          return controls.volume(state.volume + 0.05)
        case "ArrowDown":
          return controls.volume(state.volume - 0.05)
        case "m":
        case "M":
          return state.muted ? controls.unmute() : controls.mute()
        case "f":
        case "F":
          return fullscreen.toggle()
      }
  })

  useEvent(
    "ended",
    () => {
      if (loop.value === "none" && queue.length === 1) controls.pause()
      else if (loop.value === "all" && queue.length === 1) {
        controls.seek(0)
        void controls.play()
      } else actions.next()
    },
    ref.current,
  )

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => controls.play())
      navigator.mediaSession.setActionHandler("pause", () => controls.pause())
      navigator.mediaSession.setActionHandler("stop", () => {
        controls.seek(0)
        controls.pause()
      })

      if (isIos()) {
        navigator.mediaSession.setActionHandler("seekbackward", () =>
          controls.seek(state.time - 10),
        )
        navigator.mediaSession.setActionHandler("seekforward", () => controls.seek(state.time + 10))
      }

      navigator.mediaSession.setActionHandler(
        "seekto",
        (details) => details.seekTime && controls.seek(details.seekTime),
      )
    }
  }, [navigator, controls, state])

  useTitle(currentMusic ? `${currentMusic?.artist} - ${currentMusic?.title}` : "Kmotion", {
    restoreOnUnmount: true,
  })

  const initializedTime = useRef(false)

  useEffect(() => {
    if (!initializedTime.current && state.playing) {
      const time = localStorage.getItem(LOCAL_STORAGE_KEYS.TIME)
      if (time) controls.seek(Number(time))
      initializedTime.current = true
    }
  }, [state.playing])

  if (assets.stream.url && state.playing && state.time > 1)
    localStorage.setItem(LOCAL_STORAGE_KEYS.TIME, state.time.toString())

  useMount(() => {
    const volume = localStorage.getItem(LOCAL_STORAGE_KEYS.VOLUME)

    if (volume && !isNaN(+volume)) controls.volume(+volume)
  })

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VOLUME, state.volume.toString())
  }, [state?.volume])

  const tRef = useRef<HTMLElement>(null)

  if (!currentMusic) return null

  const isOverflow =
    (tRef.current?.offsetWidth || 0) >= (tRef.current?.parentElement?.offsetWidth || 2000)

  return (
    <>
      {audio}
      <FullscreenPlayer isOpen={fullscreen.value} state={state} controls={controls} />
      <div
        onClick={handleStopPropagation(() => fullscreen.toggle())}
        className={classnames(
          "relative z-[30] border-b border-neutral-800 cursor-default",
          isLaggedBlur ? "bg-secondary-dark/90" : "bg-secondary-dark/70 backdrop-blur",
        )}
      >
        <div className="flex items-center py-2 lg:py-4 px-2 lg:px-16 justify-between">
          <div className="w-3/5 flex items-center">
            <div className="w-1/3 md:w-1/4 pr-1.5">
              {assets.cover.isFetching ? (
                <div className="rounded-md bg-gray-200 animate-pulse w-fit">
                  <img
                    className="opacity-0 rounded-md max-h-20"
                    src="/images/placeholder.png"
                    alt={`cover of ${currentMusic.title}`}
                  />
                </div>
              ) : (
                <img
                  className="shadow-xl max-h-20 rounded-md"
                  src={assets.cover.url}
                  alt={`cover of ${currentMusic.title}`}
                />
              )}
            </div>
            <div className="w-2/3 md:w-3/4 overflow-hidden lg:text-center px-4 lg:px-5">
              <span
                ref={tRef}
                className={classnames(
                  "text-sm lg:text-3xl lg:font-semibold text-white inline-block whitespace-nowrap",
                  { "overflow-defilement": isOverflow },
                )}
              >
                {currentMusic.title}
              </span>
              <span className="hidden lg:block text-lg text-white/70">{currentMusic.artist}</span>
            </div>
          </div>
          <div className="w-2/5 flex justify-center items-center space-x-5 md:space-x-16">
            <div>
              <i className="text-2xl md:text-3xl lg:text-5xl text-white cursor-pointer">
                <FaBackward
                  onClick={handleStopPropagation(
                    state.time <= 5 ? actions.previous : () => controls.seek(0),
                  )}
                />
              </i>
            </div>
            <div>
              <i
                className="text-2xl md:text-3xl lg:text-5xl text-white cursor-pointer"
                onClick={handleStopPropagation(togglePlaying)}
              >
                {state.playing ? <FaPause /> : <FaPlay />}
              </i>
            </div>
            <div>
              <i className="text-2xl md:text-3xl lg:text-5xl text-white cursor-pointer">
                <FaForward onClick={handleStopPropagation(actions.next)} />
              </i>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 w-full bg-white/30 h-[1.5px]"
          style={{ width: `${roundMinMax((state.time / state.duration) * 100, 0, 100, 1)}%` }}
        />
      </div>
    </>
  )
}

export default SmallPlayer
