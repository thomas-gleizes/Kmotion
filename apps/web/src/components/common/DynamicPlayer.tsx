import React, { MouseEventHandler, useRef } from "react"
import classnames from "classnames"
import { useAudio, useEvent, useTitle } from "react-use"
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/all"

import { usePlayerContext } from "../../contexts/player"
import FullscreenPlayer from "../modals/FullscreenPlayer"

const DynamicPlayer: Component = () => {
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
        className="flex items-center z-30 py-2 px-3 border-b border-neutral-800 transition-all transform duration-300 ease-in-out h-[50px] justify-between bg-opacity-70 bg-secondary backdrop-blur cursor-default"
      >
        <div className="flex items-center transition-all h-[50px] w-[65%] space-x-4 py-2">
          <div className="h-full">
            <img
              className="shadow-xl h-full rounded-md"
              src={assets.cover.url}
              alt={`cover of ${currentMusic.title}`}
            />
          </div>
          <div className="overflow-hidden w-[170px]">
            <span
              ref={tRef}
              className={classnames("text-sm text-white inline-block whitespace-nowrap", {
                "overflow-defilement": isOverflow,
              })}
            >
              {currentMusic.title}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center w-[35%]">
          <div>
            <i className="text-2xl text-white cursor-pointer">
              <FaBackward onClick={handleStopPropagation(actions.previous)} />
            </i>
          </div>
          <div>
            <i
              className="text-2xl text-white cursor-pointer"
              onClick={handleStopPropagation(togglePlaying)}
            >
              {state.playing ? <FaPause /> : <FaPlay />}
            </i>
          </div>
          <div>
            <i className="text-2xl text-white cursor-pointer">
              <FaForward onClick={handleStopPropagation(actions.next)} />
            </i>
          </div>
        </div>
      </div>
    </>
  )
}

export default DynamicPlayer
