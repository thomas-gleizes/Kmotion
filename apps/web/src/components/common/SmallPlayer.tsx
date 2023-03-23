import React, { MouseEventHandler, useRef } from "react"
import classnames from "classnames"
import { useAudio, useEvent, useTitle } from "react-use"
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/all"

import { usePlayerContext } from "../../contexts/player"
import FullscreenPlayer from "../modals/FullscreenPlayer"

const SmallPlayer: Component = () => {
  const { currentMusic, queue, actions, loop, fullscreen, assets } = usePlayerContext()

  const [audio, state, controls, ref] = useAudio(
    <audio src={assets.stream.isFetching ? "" : assets.stream.url} autoPlay={true} />
  )
  const togglePlaying = () => (state.playing ? controls.pause() : controls.play())

  useEvent("keydown", (event: KeyboardEvent) => {
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

  useTitle(currentMusic?.title || "Kmotion")

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
        close={fullscreen.toggle}
        state={state}
        controls={controls}
      />
      <div
        onClick={handleStopPropagation(fullscreen.toggle)}
        className="flex items-center z-30 py-2 lg:py-4 px-3 lg:px-16 border-b border-neutral-800 transition-all transform duration-300 ease-in-out justify-between bg-opacity-70 bg-secondary backdrop-blur cursor-default"
      >
        <div className="flex items-center">
          <div className="w-1/4">
            <img
              className="shadow-xl max-h-20 rounded-md"
              src={assets.cover.url}
              alt={`cover of ${currentMusic.title}`}
            />
          </div>
          <div className="overflow-hidden w-3/4 lg:text-center px-4 lg:px-10">
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
        <div className="flex justify-center items-center space-x-5 md:space-x-16">
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
    </>
  )
}

export default SmallPlayer
