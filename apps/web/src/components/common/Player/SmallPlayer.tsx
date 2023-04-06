import React, { MouseEventHandler, useEffect, useRef } from "react"
import classnames from "classnames"
import { useAudio, useEvent, useTitle } from "react-use"
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/all"

import { usePlayerContext } from "../../../contexts/player"
import FullscreenPlayer from "./FullscreenPlayer"
import { roundMinMax } from "../../../utils/number"

const SmallPlayer: Component = () => {
  const { currentMusic, queue, actions, loop, fullscreen, assets } = usePlayerContext()

  const [audio, state, controls, ref] = useAudio(<audio src={assets.stream.url} autoPlay={true} />)
  const togglePlaying = () => (state.playing ? controls.pause() : controls.play())

  useEvent("keydown", (event) => {
    if (event.target.tagName !== "INPUT")
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
          return state.muted ? controls.unmute() : controls.mute()
        case "f":
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
    ref.current
  )

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => controls.play())
      navigator.mediaSession.setActionHandler("pause", () => controls.pause())
      navigator.mediaSession.setActionHandler("stop", (details) => console.log("stop", details))

      navigator.mediaSession.setActionHandler("seekbackward", () => controls.seek(state.time - 10))
      navigator.mediaSession.setActionHandler("seekforward", () => controls.seek(state.time + 10))
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        console.log("details")
        details.seekTime && controls.seek(details.seekTime)
      })
    }
  }, [navigator, controls, state])

  useTitle(currentMusic ? `${currentMusic?.artist} - ${currentMusic?.title}` : "Kmotion", {
    restoreOnUnmount: true,
  })

  const tRef = useRef<HTMLElement>(null)

  if (!currentMusic) return null

  const handleStopPropagation = (callback: () => void): MouseEventHandler => {
    return (event) => {
      event.stopPropagation()
      callback()
    }
  }

  const isOverflow =
    (tRef.current?.offsetWidth || 0) >= (tRef.current?.parentElement?.offsetWidth || 2000)

  return (
    <>
      {audio}
      <FullscreenPlayer
        isOpen={fullscreen.value}
        close={() => fullscreen.toggle()}
        state={state}
        controls={controls}
      />
      <div
        onClick={handleStopPropagation(fullscreen.toggle)}
        className="relative z-[30] border-b border-neutral-800 bg-opacity-70 bg-secondary backdrop-blur cursor-default"
      >
        <div className="flex items-center py-2 lg:py-4 px-2 lg:px-16 justify-between">
          <div className="w-3/5 flex items-center">
            <div className="w-1/3 md:w-1/4 pr-1.5">
              <img
                className="shadow-xl max-h-20 rounded-md"
                src={assets.cover.url}
                alt={`cover of ${currentMusic.title}`}
              />
            </div>
            <div className="w-2/3 md:w-3/4 overflow-hidden lg:text-center px-4 lg:px-5">
              <span
                ref={tRef}
                className={classnames(
                  "text-sm lg:text-2xl text-white inline-block whitespace-nowrap",
                  { "overflow-defilement": isOverflow }
                )}
              >
                {currentMusic.title}
              </span>
            </div>
          </div>
          <div className="w-2/5 flex justify-center items-center space-x-5 md:space-x-16">
            <div>
              <i className="text-2xl md:text-3xl lg:text-5xl text-white cursor-pointer">
                <FaBackward onClick={handleStopPropagation(actions.previous)} />
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
