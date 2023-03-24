import React, { useMemo, useRef } from "react"
import {
  FaBackward,
  FaBars,
  FaEllipsisH,
  FaForward,
  FaListUl,
  FaPause,
  FaPlay,
  FaRandom,
  FaSpaceShuttle,
  FaSync,
  FaSyncAlt,
  FaVolumeDown,
  FaVolumeUp,
} from "react-icons/all"
import classnames from "classnames"
import SimpleBar from "simplebar-react"
import { useToggle } from "react-use"

import { usePlayerContext } from "../../contexts/player"
import { formatTime } from "../../utils/time"
import { roundMinMax } from "../../utils/number"
import Modal from "../common/Modal"
import Slider from "../common/Slider"
import ImageLoader from "../common/ImageLoader"

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
  const { currentMusic, actions, loop, assets, queue } = usePlayerContext()

  const tRef = useRef<HTMLHeadingElement>(null)

  const [showQueue, toggleShowQueue] = useToggle(false)

  if (!currentMusic) return null

  const isOverflow =
    (tRef.current?.offsetWidth || 0) >= (tRef.current?.parentElement?.offsetWidth || 2000)

  const nextMusics = useMemo(() => {
    const nextMusics = [...queue]
    nextMusics.splice(0, 1)
    return nextMusics
  }, [queue])

  return (
    <Modal isOpen={isOpen}>
      <div className="relative h-screen -top-header w-full">
        <div className="absolute top-0 left-0 w-full h-full">
          <img src={assets.cover.url} alt="cover" className="h-full w-full" />
        </div>
        <div className="h-full pt-header pb-footer bg-black/20 backdrop-blur-[135px] backdrop-brightness-[125%] backdrop-saturate-[150%]">
          <div
            className={classnames(
              "h-full grid px-7 pt-2 pb-5 grid-cols-8 grid-rows-8 lg:place-content-center"
            )}
          >
            <div
              className={classnames(
                "z-90 transition-all h-min py-3",
                showQueue
                  ? "col-span-2 row-span-1"
                  : "row-span-3 col-span-full lg:row-span-8 lg:col-span-5"
              )}
            >
              <img
                src={assets.cover.url}
                alt={currentMusic.title}
                className={classnames(
                  "rounded-lg lg:rounded-2xl shadow-2xl transition-all duration-500 ease-in-out z-90 select-none w-full",
                  {
                    "scale-[75%] shadow-lg": state.paused && !showQueue,
                    "lg:w-[80%] mx-auto": !showQueue,
                  }
                )}
              />
            </div>
            <div
              className={classnames(
                "flex justify-between items-center h-min",
                showQueue
                  ? "col-span-6 row-span-1 py-3 px-5"
                  : "col-span-full row-span-2 lg:col-span-3 lg:row-span-1"
              )}
            >
              <div className="w-full overflow-hidden">
                <h3
                  ref={tRef}
                  className={classnames(
                    "text-white w-[170px] text-lg font-semibold capitalize py-1.5 leading-[0.5rem] inline-block whitespace-nowrap",
                    { "overflow-defilement": isOverflow }
                  )}
                >
                  {currentMusic.title}
                </h3>
                <p className="text-white/80 text-lg py-1.5 leading-[0.5rem]">
                  {currentMusic.artist}
                </p>
              </div>
              <div className="flex justify-end items-center">
                <div className="flex items-center justify-center cursor-pointer bg-white/50 backdrop-blur rounded-full h-7 w-7">
                  <FaEllipsisH className="text-white text-lg" />
                </div>
              </div>
            </div>
            <div
              className={classnames(
                "transition-opacity duration-1000 relative",
                showQueue ? "col-span-full row-span-4 bg-opacity-100" : "hidden bg-opacity-0"
              )}
            >
              <div className="w-full flex justify-between items-center mb-2">
                <div>
                  <h6 className="text-xl text-white/90 mb-0.5">Suivant</h6>
                  <p className="text-base text-white/75">De Current playlist</p>
                </div>
                <div className="flex justify-end space-x-4">
                  <span className="text-xl text-white">
                    <FaSpaceShuttle />
                  </span>
                  <span className="text-xl text-white">
                    <FaSyncAlt />
                  </span>
                </div>
              </div>
              <SimpleBar className="max-h-[30vh] pr-3">
                <div className="flex flex-col space-y-3">
                  {nextMusics.map((music, index) => (
                    <div
                      key={index}
                      className="flex space-x-3"
                      onClick={() => actions.go(index + 1)}
                    >
                      <div className="w-1/5">
                        <ImageLoader src={music.links.cover}>
                          {({ src }) => (
                            <img
                              src={src}
                              alt={`cover ${music.title}`}
                              className="rounded-lg w-full"
                            />
                          )}
                        </ImageLoader>
                      </div>
                      <div className="w-4/5 flex justify-between">
                        <div className="truncate w-[200px]">
                          <h6 className="text-white/95 text-sm">{music.title}</h6>
                          <p className="text-white/75 text-xs">{music.artist}</p>
                        </div>
                        <div>
                          <span className="text-white/70">
                            <FaBars />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SimpleBar>
              <div className="absolute h-[50px] bottom-0 w-full bg-gradient-to-t from-transparent/0 to-transparent"></div>
            </div>
            <div
              className={classnames(
                "flex flex-col",
                showQueue ? "col-span-8" : "col-span-8 lg:col-span-3 lg:row-span-1"
              )}
            >
              {!showQueue && (
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
              )}
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
                  onClick={() => loop.set("all")}
                  className={classnames(
                    "text-white rounded-full text-xl lg:text-2xl transition transform duration-200",
                    loop.value !== "none" ? "text-opacity-90 scale-110" : "text-opacity-50"
                  )}
                >
                  {loop.value === "all" ? <FaSync /> : <FaSyncAlt />}
                </i>
                <i
                  onClick={actions.shuffle}
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
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FullscreenPlayer
