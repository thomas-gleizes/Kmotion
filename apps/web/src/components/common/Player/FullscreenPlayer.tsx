import React, { useRef } from "react"
import SimpleBar from "simplebar-react"
import classnames from "classnames"
import { useToggle } from "react-use"
import {
  FaBackward,
  FaBars,
  FaEllipsisH,
  FaForward,
  FaListUl,
  FaPause,
  FaPlay,
  FaRandom,
  FaSync,
  FaSyncAlt,
  FaVolumeDown,
  FaVolumeUp,
} from "react-icons/all"

import { usePlayerContext } from "../../../contexts/player"
import { formatTime } from "../../../utils/time"
import { roundMinMax } from "../../../utils/number"
import DynamicDialog from "../DynamicDialog"
import Slider from "../Slider"
import QueueList from "./QueueList"

interface Props {
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

const FullscreenPlayer: ModalComponent<Props> = ({ isOpen, state, controls }) => {
  const { currentMusic, playlist, actions, loop, assets, queue } = usePlayerContext()

  const tRef = useRef<HTMLHeadingElement>(null)

  const [showQueue, toggleShowQueue] = useToggle(false)

  if (!currentMusic) return null

  const isOverflow =
    (tRef.current?.offsetWidth || 0) >= (tRef.current?.parentElement?.offsetWidth || 2000)

  const ImageBlock = (
    <div
      onClick={showQueue ? toggleShowQueue : undefined}
      className={classnames(
        "flex items-center transition-all duration-300 h-full lg:px-16",
        showQueue ? "pr-2 w-2/5 lg:w-full" : "w-full lg:flex-col lg:justify-center"
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
          className={classnames(
            "rounded-lg w-full transform transition-all duration-300 lg:rounded-2xl shadow-2xl select-none",
            { "scale-[75%] shadow-lg": state.paused }
          )}
        />
      )}
    </div>
  )

  const TitleBlock = (
    <div className="flex justify-between items-center">
      <div className="w-full overflow-hidden whitespace-nowrap">
        <h3
          ref={tRef}
          className={classnames(
            "text-white text-lg lg:text-xl xl:text-3xl font-semibold capitalize py-1.5 inline-block whitespace-nowrap",
            { "overflow-defilement": isOverflow }
          )}
        >
          {currentMusic.title}
        </h3>
        <p className="text-white/80 text-base lg:text-lg xl:text-xl py-1.5 leading-[0.5rem]">
          {currentMusic.artist}
        </p>
      </div>
      <div className="flex justify-end items-center pl-3">
        <div className="cursor-pointer bg-white/40 rounded-full p-2">
          <FaEllipsisH className="text-white text-lg lg:text-2xl" />
        </div>
      </div>
    </div>
  )

  const ControlsBlock = (
    <div className={classnames("h-full flex flex-col space-y-5", showQueue ? "" : "")}>
      <div className="flex flex-col group">
        <div className="h-2 w-full transform group-active:scale-y-150 transition duration-200 mb-3">
          <Slider
            value={roundMinMax((state.time / state.duration) * 100, 0, 100, 1)}
            onChange={(value) => controls.seek((value * state.duration) / 100)}
          />
        </div>
        <div className="flex justify-between">
          <div className="text-sm text-white/80 group-active:text-white group-active:scale-110 transition duration-200">
            <span>{formatTime(state.time)}</span>
          </div>
          <div className="text-sm text-white/80 group-active:text-white group-active:scale-110 transition duration-200">
            <span>-{formatTime(state.duration - state.time)}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-10/12 mx-auto">
        <div className="text-white text-4xl hover:scale-110 transform transition duration-200 cursor-pointer">
          <i onClick={actions.previous} className="rounded-full">
            <FaBackward />
          </i>
        </div>
        <div className="text-white text-4xl hover:scale-110 transform transition duration-200 cursor-pointer">
          <i onClick={state.paused ? controls.play : controls.pause} className="rounded-full">
            {state.paused ? <FaPlay /> : <FaPause />}
          </i>
        </div>
        <div className="text-white text-4xl hover:scale-110 transform transition duration-200 cursor-pointer">
          <i onClick={actions.next} className="rounded-full">
            <FaForward />
          </i>
        </div>
      </div>
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
      <div className="flex justify-between items-center w-9/12 mx-auto">
        <i
          onClick={() => loop.set("all")}
          className={classnames(
            "text-white rounded-full text-xl lg:text-2xl transition transform duration-200",
            loop.value !== "none" ? "text-opacity-90 scale-110" : "text-opacity-50"
          )}
        >
          {loop.value === "all" ? <FaSync /> : <FaSyncAlt />}
        </i>
        <i
          onClick={() => actions.shuffle()}
          className={classnames(
            "text-white rounded-full text-xl lg:text-2xl transition transform duration-200",
            currentMusic.title.length & 1 ? "text-opacity-90 scale-110" : "text-opacity-50"
          )}
        >
          <FaRandom />
        </i>
        <i
          onClick={toggleShowQueue}
          className={classnames(
            "text-white text-opacity-50 duration-200 rounded-full text-xl lg:text-2xl transition transform duration-200",
            { "text-opacity-90": showQueue }
          )}
        >
          <FaListUl />
        </i>
      </div>
    </div>
  )

  return (
    <DynamicDialog isOpen={isOpen}>
      <div className="relative z-[100] h-screen -top-header w-full">
        <div className="absolute top-0 left-0 w-full h-full">
          <img src={assets.cover.url} alt="cover" className="h-full w-full" />
        </div>
        <div className="h-full pt-header pb-footer bg-black/20 backdrop-blur-[150px] lg:backdrop-blur-[500px] backdrop-brightness-[125%] backdrop-saturate-[150%]">
          <div className={classnames("h-full px-6 lg:px-10 py-4")}>
            <div className="h-full flex flex-col lg:flex-row justify-evenly lg:items-center">
              <div
                className={classnames(
                  "flex items-center lg:w-2/3",
                  showQueue ? "lg:h-full pt-4" : "w-full h-min"
                )}
              >
                {ImageBlock}
                <div
                  className={classnames(
                    showQueue ? "w-3/5" : "w-0 hidden",
                    "transition-all transform-gpu lg:w-0 lg:hidden"
                  )}
                >
                  {TitleBlock}
                </div>
              </div>
              <div
                className={classnames(
                  "lg:w-1/3 xl:px-5 lg:px-5",
                  showQueue
                    ? "w-full flex flex-col justify-evenly"
                    : "flex flex-col justify-between lg:justify-center"
                )}
              >
                <div className={classnames(showQueue ? "hidden lg:block" : "")}>{TitleBlock}</div>
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
                    <SimpleBar className="h-[calc(100vh-420px)] lg:h-[calc(75vh-450px)]">
                      <QueueList />
                    </SimpleBar>
                  )}
                  <div className="h-min py-2">{ControlsBlock}</div>
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
