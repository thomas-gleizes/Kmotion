import React, { useRef } from "react"
import {
  FaBackward,
  FaEllipsisH,
  FaExpand,
  FaForward,
  FaPause,
  FaPlay,
  FaRandom,
  FaSync,
  FaSyncAlt,
  FaVolumeDown,
  FaVolumeUp,
} from "react-icons/all"
import classnames from "classnames"

import { usePlayerContext } from "../../contexts/player"
import { formatTime } from "../../utils/time"
import { roundMinMax } from "../../utils/number"
import Modal from "../common/Modal"
import Slider from "../common/Slider"

interface Props {
  isOpen: boolean
  close: () => void
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

const FullscreenPlayer: ModalComponent<Props> = ({ isOpen, close, state, controls }) => {
  const { currentMusic, actions, loop, assets } = usePlayerContext()

  const tRef = useRef<HTMLHeadingElement>(null)

  if (!currentMusic) return null

  const isOverflow =
    (tRef.current?.offsetWidth || 0) >= (tRef.current?.parentElement?.offsetWidth || 2000)

  return (
    <Modal isOpen={isOpen}>
      <div className="relative h-full w-full">
        <div className="absolute top-0 left-0 w-full h-full">
          <img src={assets.cover.url} alt="cover" className="h-full w-full " />
        </div>
        <div className="h-full pb-10 px-8 bg-black/20 backdrop-blur-[135px] backdrop-brightness-[125%] backdrop-saturate-[150%]">
          <div className="h-full flex flex-col justify-center space-y-10 lg:space-y-0 lg:flex-row lg:items-center">
            <div className="px-2 my-8 z-90 lg:w-[60%]">
              <img
                src={assets.cover.url}
                alt={currentMusic.title}
                className={classnames(
                  "rounded-lg shadow-2xl transition-all duration-500 ease-in-out z-90 select-none w-full",
                  { "scale-[75%] shadow-lg": state.paused }
                )}
              />
            </div>
            <div className="flex flex-col lg:space-y-10  mx-2 lg:w-[40%] lg:px-8 xl:px-28">
              <div className="flex justify-between items-center mt-2">
                <div className="basis-10/12 overflow-hidden w-[170px]">
                  <h3
                    ref={tRef}
                    className={classnames(
                      "text-white text-lg font-semibold capitalize py-1.5 leading-[0.5rem] inline-block whitespace-nowrap",
                      { "overflow-defilement": isOverflow }
                    )}
                  >
                    {currentMusic.title}
                  </h3>
                  <p className="text-white/80 text-lg py-1.5 leading-[0.5rem]">
                    {currentMusic.artist}
                  </p>
                </div>
                <div className="basis-2/12 flex justify-end items-center">
                  <div className="flex items-center justify-center cursor-pointer bg-white/50 backdrop-blur rounded-full h-7 w-7">
                    <FaEllipsisH className="text-white text-lg" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 mt-2.5 group">
                <div className="h-2 w-full transform group-active:scale-y-150 transition duration-200">
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
              <div className="flex justify-between mx-8 mt-4">
                <div className="text-white text-4xl hover:scale-110 transform transition duration-200 cursor-pointer">
                  <i onClick={actions.previous} className="rounded-full">
                    <FaBackward />
                  </i>
                </div>
                <div className="text-white text-4xl hover:scale-110 transform transition duration-200 cursor-pointer">
                  <i
                    onClick={state.paused ? controls.play : controls.pause}
                    className="rounded-full"
                  >
                    {state.paused ? <FaPlay /> : <FaPause />}
                  </i>
                </div>
                <div className="text-white text-4xl hover:scale-110 transform transition duration-200 cursor-pointer">
                  <i onClick={actions.next} className="rounded-full">
                    <FaForward />
                  </i>
                </div>
              </div>
              <div className="flex justify-between items-center space-x-5 mt-6 group">
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
              <div className="flex justify-between items-center mx-9 mt-10">
                <i
                  onClick={close}
                  className={
                    "text-white text-opacity-50 active:text-opacity-90 duration-200 rounded-full text-xl transition transform duration-200"
                  }
                >
                  <FaExpand />
                </i>
                <i
                  onClick={() => loop.set("all")}
                  className={classnames(
                    "text-white rounded-full text-xl transition transform duration-200",
                    loop.value !== "none" ? "text-opacity-90 scale-110" : "text-opacity-50"
                  )}
                >
                  {loop.value === "all" ? <FaSync /> : <FaSyncAlt />}
                </i>
                <i
                  onClick={actions.shuffle}
                  className={classnames(
                    "text-white rounded-full text-xl transition transform duration-200",
                    currentMusic.title.length & 1 ? "text-opacity-90 scale-110" : "text-opacity-50"
                  )}
                >
                  <FaRandom />
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FullscreenPlayer
