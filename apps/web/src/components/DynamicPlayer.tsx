import React, { MouseEvent, MouseEventHandler } from "react"
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/all"
import { useAudio, useEvent, useTitle, useToggle } from "react-use"
import { usePlayerContext } from "../contexts/player"
import playlist from "../pages/app/Playlist"
import classnames from "classnames"

const DynamicPlayer: Component = () => {
  const { currentMusic, queue, actions, loop } = usePlayerContext()

  const [isFullscreen, toggleFullscreen] = useToggle(false)

  const [audio, state, controls, ref] = useAudio({
    src: currentMusic?.links.stream || "",
    autoPlay: true,
  })

  const togglePlaying = () => (state.playing ? controls.pause() : controls.play())

  useEvent("keydown", (event: KeyboardEvent) => {
    switch (event.key) {
      case " ":
        return togglePlaying()
      case "ArrowLeft":
        return controls.seek(state.time)
      case "ArrowRight":
        return controls.seek(state.time + 50)
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
        controls.play()
      } else actions.next()
    },
    ref.current
  )

  const handleStopPropagation = (callback: () => void): MouseEventHandler => {
    return (event) => {
      event.stopPropagation()
      callback()
    }
  }

  useTitle(currentMusic?.title || "Kmotion")

  if (!currentMusic) return null

  // @ts-ignore
  return (
    <>
      {audio}
      <div
        onClick={handleStopPropagation(toggleFullscreen)}
        className={classnames(
          "flex items-center z-30 py-2 px-3 border-b border-neutral-800 transition-all transform duration-300 ease-in-out",
          isFullscreen
            ? "h-[634px] flex-col bg-black space-y-8"
            : "h-[50px] justify-between bg-opacity-70 bg-dark backdrop-blur cursor-default"
        )}
      >
        <div
          className={classnames(
            "flex items-center transition-all",
            isFullscreen
              ? "px-10 mt-20 h-[250px] flex-col justify-between"
              : "h-[50px] w-[65%] space-x-4 py-2"
          )}
        >
          <div className="h-full">
            <img
              className={classnames("shadow-xl", isFullscreen ? "rounded-xl" : "h-full rounded-md")}
              src={`/api/v1/musics/${currentMusic.id}/cover`}
              alt={`cover of ${currentMusic.title}`}
            />
          </div>
          <div className={classnames("truncate", { "max-w-[160px]": !isFullscreen })}>
            <p
              className={classnames("text-sm text-white", {
                "text-scroll-overflow": !isFullscreen,
              })}
            >
              {currentMusic.title}
            </p>
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
