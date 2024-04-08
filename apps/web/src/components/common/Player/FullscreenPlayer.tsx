import React, { MouseEventHandler, useMemo, useState } from "react"
import classnames from "classnames"
import { useToggle } from "react-use"
import {
  FaBackward,
  FaBars,
  FaCheck,
  FaForward,
  FaListUl,
  FaPause,
  FaPlay,
  FaRandom,
  FaSpinner,
  FaSyncAlt,
  FaTimes,
  FaVolumeDown,
  FaVolumeUp,
  FaWindowMinimize,
} from "react-icons/fa"
import { TbPictureInPictureOff, TbPictureInPictureOn } from "react-icons/tb"

import { usePlayerContext } from "../../../contexts/player"
import { formatTime } from "../../../utils/time"
import { roundMinMax } from "../../../utils/number"
import Slider from "../Slider"
import QueueList from "./QueueList"
import { useLayoutContext } from "../../../contexts/layout"
import DynamicDialog from "../DynamicDialog"
import ScrollableContainer from "../../layouts/ScrollableContainer"
import TitlePlayer from "./TitlePlayer"
import { isIos, isMobileOrTablet } from "../../../utils/helpers"

interface Props {
  isOpen: boolean
  state: {
    paused: boolean
    time: number
    duration: number
    volume: number
  }
  controls: {
    play: () => Promise<void> | undefined
    pause: () => void
    seek: (time: number) => void
    volume: (volume: number) => void
    mute: () => void
    unmute: () => void
  }
}

const FullscreenPlayer: Component<Props> = ({ isOpen, state, controls }) => {
  const {
    currentMusic,
    playlist,
    actions,
    loop,
    assets,
    playing,
    isShuffled,
    pictureInPicture,
    fullscreen,
    clear,
  } = usePlayerContext()
  const { isLaggedBlur } = useLayoutContext()

  const [showQueue, toggleShowQueue] = useToggle(false)

  const [tap, setTap] = useState<"left" | "right">()
  const handleDoubleTapScreen: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isMobileOrTablet()) return

    const limit = event.currentTarget.offsetWidth * 0.2

    if (event.clientX < limit) {
      setTap("left")
      controls.seek(state.time - 10)
    } else if (event.clientX > event.currentTarget.offsetWidth - limit) {
      setTap("right")
      controls.seek(state.time + 10)
    }

    setTimeout(() => setTap(undefined), 800)
  }

  const isMobile = useMemo<boolean>(() => isMobileOrTablet(), [])

  if (!currentMusic) return null

  return (
    <DynamicDialog isOpen={isOpen}>
      <div
        className="relative z-[90] -top-header w-full"
        onDoubleClick={handleDoubleTapScreen}
        style={{ height: "100svh" }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <img src={assets.cover.url} alt="cover" className="h-full w-full" />
        </div>

        <div className="absolute flex space-x-2 top-3 left-3 z-20">
          <FaTimes className="text-white" onClick={clear} />
          {!isMobile && (
            <FaWindowMinimize className="text-white" onClick={() => fullscreen.toggle()} />
          )}
        </div>

        <div className="absolute top-3 right-3 z-20">
          {assets.next.isFetching ? (
            <FaSpinner className="text-white animate-spin" />
          ) : (
            <FaCheck className="text-white" />
          )}
        </div>
        {isMobile && (
          <>
            {tap === "left" && (
              <div className="absolute top-[-50%] left-[-125%] h-[200%] w-[120%] z-100">
                <div className="absolute top-0 left-[-25%] animate-ping-border h-full w-full rounded-r-[100%] bg-black/50" />
                <div className="absolute top-0 left-0 animate-ping-border h-full w-full rounded-r-[100%] bg-black/30" />
              </div>
            )}
            {tap === "right" && (
              <div className="absolute top-[-50%] right-[-125%] h-[200%] w-[120%] z-100">
                <div className="absolute top-0 right-[-25%] animate-ping-border h-full w-full rounded-l-[100%] bg-black/50" />
                <div className="absolute top-0 right-0 animate-ping-border h-full w-full rounded-l-[120%] bg-black/30" />
              </div>
            )}
          </>
        )}

        <div
          className={classnames(
            "h-full pt-header pb-footer",
            !isLaggedBlur
              ? "bg-black/10 backdrop-blur-[150px] lg:backdrop-blur-[500px] backdrop-brightness-[125%] backdrop-saturate-[150%]"
              : "backdrop-blur-[0px] bg-secondary/80",
          )}
        >
          <div className={classnames("h-full px-6 lg:px-10 py-4")}>
            <div className="h-full flex flex-col lg:flex-row justify-evenly lg:items-center">
              <div
                className={classnames(
                  "flex items-center lg:w-2/3",
                  showQueue ? "lg:h-full pt-4" : "w-full h-min",
                )}
              >
                <div
                  className={classnames(
                    "flex items-center transition-all duration-300 h-full lg:px-16",
                    showQueue ? "pr-2 w-2/5 lg:w-full" : "w-full lg:flex-col lg:justify-center",
                  )}
                >
                  {assets.cover.isFetching ? (
                    <div className="rounded-md bg-gray-200 animate-pulse w-fit">
                      <img
                        className="rounded-lg w-full transform opacity-0 transition-all duration-300 lg:rounded-2xl shadow-2xl select-none"
                        src="/images/placeholder.png"
                        alt={`cover of ${currentMusic.title}`}
                      />
                    </div>
                  ) : (
                    <img
                      src={assets.cover.url}
                      alt={currentMusic.title}
                      onClick={() => (showQueue && isMobile ? toggleShowQueue() : playing.toggle())}
                      className={classnames(
                        "rounded-lg w-full transform transition-all duration-300 lg:rounded-2xl shadow-2xl select-none",
                        { "scale-[75%] shadow-lg": !playing.value },
                      )}
                    />
                  )}
                </div>
                <div
                  className={classnames(
                    showQueue ? "w-3/5" : "w-0 hidden",
                    "transition-all transform-gpu lg:w-0 lg:hidden",
                  )}
                >
                  <TitlePlayer music={currentMusic} />
                </div>
              </div>
              <div
                className={classnames(
                  "lg:w-1/3 xl:px-5 lg:px-5 md:py-8 bg-transparent md:bg-black md:bg-opacity-10 md:rounded-xl",
                  showQueue
                    ? "w-full flex flex-col justify-evenly"
                    : "flex flex-col justify-between lg:justify-center",
                )}
              >
                <div className={classnames(showQueue ? "hidden lg:block" : "")}>
                  <TitlePlayer music={currentMusic} />
                </div>
                <div className="flex flex-col justify-center h-full py-3">
                  {showQueue && (
                    <div className="flex justify-between items-center pb-3">
                      <div>
                        <h6 className="text-xl lg:text-2xl font-semibold text-white/90 mb-0.5">
                          Suivant
                        </h6>
                        <p className="text-base text-white/75">De {playlist.value?.title}</p>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <span className="text-xl text-white">
                          <FaBars />
                        </span>
                        <span className="text-xl text-white">
                          <FaSyncAlt />
                        </span>
                      </div>
                    </div>
                  )}
                  {showQueue && (
                    <ScrollableContainer className="h-[calc(100svh-380px)] lg:h-[calc(75svh-450px)]">
                      <QueueList />
                    </ScrollableContainer>
                  )}
                  <div className="h-min py-2">
                    <div
                      className={classnames("h-full flex flex-col space-y-5", showQueue ? "" : "")}
                    >
                      <div className="flex flex-col group">
                        <div className="h-2 w-full transform group-active:scale-y-150 transition duration-200 mb-3">
                          {!assets.stream.isFetching ? (
                            <Slider
                              value={roundMinMax((state.time / state.duration) * 100, 0, 100, 1)}
                              onChange={(value) => controls.seek((value * state.duration) / 100)}
                            />
                          ) : (
                            <div className="stripped h-full rounded-full w-full bg-white/30" />
                          )}
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm lg:text-base text-white/80 group-active:text-white group-active:scale-110 transition duration-200">
                            <span>{!assets.stream.isFetching ? formatTime(state.time) : "∞"}</span>
                          </div>
                          <div className="text-sm text-white/80 group-active:text-white group-active:scale-110 transition duration-200">
                            <span>
                              {!assets.stream.isFetching
                                ? "-" + formatTime(state.duration - state.time)
                                : "∞"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between w-10/12 mx-auto">
                        <div className="text-white text-4xl hover:scale-110 transform transition duration-200 cursor-pointer">
                          <i
                            onClick={state.time <= 5 ? actions.previous : () => controls.seek(0)}
                            className="rounded-full"
                          >
                            <FaBackward />
                          </i>
                        </div>
                        <div className="text-white text-4xl hover:scale-110 transform transition duration-200 cursor-pointer">
                          <i onClick={() => playing.toggle()} className="rounded-full">
                            {!playing.value ? <FaPlay /> : <FaPause />}
                          </i>
                        </div>
                        <div className="text-white text-4xl hover:scale-110 transform transition duration-200 cursor-pointer">
                          <i onClick={actions.next} className="rounded-full">
                            <FaForward />
                          </i>
                        </div>
                      </div>
                      {!isIos() && (
                        <div className="flex justify-between items-center space-x-4 group">
                          <div className="text-lg text-white/70 group:active:text-white group-active:scale-125 transition duration-200">
                            <i>
                              <FaVolumeDown />
                            </i>
                          </div>
                          <div className="h-2 w-full rounded-full group-active:scale-y-150 transition duration-200">
                            <Slider
                              value={roundMinMax(state.volume * 100, 0, 100, 2)}
                              onChange={(value) => controls.volume(value / 100)}
                            />
                          </div>
                          <div className="text-lg text-white/70 group:active:text-white group-active:scale-125 transition duration-200">
                            <i>
                              <FaVolumeUp />
                            </i>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center w-9/12 mx-auto">
                        <i
                          onClick={() =>
                            loop.set(
                              loop.value === "none" ? "one" : loop.value === "one" ? "all" : "none",
                            )
                          }
                          className={classnames(
                            "cursor-pointer flex items-center text-white rounded-full text-xl lg:text-2xl transition transform duration-200",
                            loop.value !== "none" ? "text-opacity-90 scale-110" : "text-opacity-50",
                          )}
                        >
                          <FaSyncAlt />
                          <sup
                            className={classnames("select-none", {
                              invisible: loop.value !== "all",
                            })}
                          >
                            *
                          </sup>
                        </i>
                        <i
                          onClick={() => actions.shuffle()}
                          className={classnames(
                            "cursor-pointer text-white rounded-full text-xl lg:text-2xl transition transform duration-200",
                            isShuffled ? "text-opacity-90 scale-110" : "text-opacity-50",
                          )}
                        >
                          <FaRandom />
                        </i>
                        <i
                          onClick={toggleShowQueue}
                          className={classnames(
                            "cursor-pointer text-white text-opacity-50 rounded-full text-xl lg:text-2xl transition transform duration-200",
                            { "text-opacity-90": showQueue },
                          )}
                        >
                          <FaListUl />
                        </i>
                        {document.pictureInPictureEnabled && (
                          <i
                            onClick={pictureInPicture.toggle}
                            className={classnames(
                              "cursor-pointer text-white text-opacity-50 rounded-full text-xl lg:text-2xl transition transform duration-200",
                              { "text-opacity-90": pictureInPicture.value },
                            )}
                          >
                            {pictureInPicture.value ? (
                              <TbPictureInPictureOn />
                            ) : (
                              <TbPictureInPictureOff />
                            )}
                          </i>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DynamicDialog>
  )
}

export default FullscreenPlayer
