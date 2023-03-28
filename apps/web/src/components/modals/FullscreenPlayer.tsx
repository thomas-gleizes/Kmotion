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

  const queueRef = useRef<HTMLDivElement>(null)

  if (!currentMusic) return null

  const isOverflow =
    (tRef.current?.offsetWidth || 0) >= (tRef.current?.parentElement?.offsetWidth || 2000)

  const nextMusics = useMemo(() => {
    const nextMusics = [...queue]
    nextMusics.splice(0, 1)
    return nextMusics
  }, [queue])

  const ImageBlock = (
    <div
      onClick={showQueue ? toggleShowQueue : undefined}
      className={classnames(
        "flex items-center transition-all duration-300 justify-center lg:h-full lg:px-16 pb-4",
        showQueue ? "pr-2 w-1/4 lg:w-full" : "w-full lg:flex-col lg:justify-center"
      )}
    >
      <img
        src={assets.cover.url}
        alt={currentMusic.title}
        className={classnames(
          "rounded-lg transform transition-all duration-300 lg:rounded-2xl shadow-2xl select-none",
          { "scale-[75%] shadow-lg": state.paused && !showQueue }
        )}
      />
    </div>
  )

  const TitleBlock = (
    <div className={classnames("flex justify-between items-center")}>
      <div className={classnames("w-full overflow-hidden")}>
        <h3
          ref={tRef}
          className={classnames(
            "text-white w-max text-lg font-semibold capitalize py-1.5 leading-[0.5rem] inline-block whitespace-nowrap",
            { "overflow-defilement": isOverflow }
          )}
        >
          {currentMusic.title}
        </h3>
        <p className="text-white/80 text-lg py-1.5 leading-[0.5rem]">{currentMusic.artist}</p>
      </div>
      <div className="flex justify-end items-center pl-3">
        <div className="flex items-center justify-center cursor-pointer bg-white/50 backdrop-blur rounded-full h-7 w-7">
          <FaEllipsisH className="text-white text-lg" />
        </div>
      </div>
    </div>
  )

  const QueueBlock = (
    <div className="flex flex-col">
      {nextMusics.map((music, index) => (
        <div key={index} className="flex py-1" onClick={() => actions.go(index + 1)}>
          <div className="w-1/5">
            <ImageLoader src={music.links.cover}>
              {({ src }) => (
                <img src={src} alt={`cover ${music.title}`} className="rounded-lg w-full" />
              )}
            </ImageLoader>
          </div>
          <div className="w-4/5 flex justify-between items-center">
            <div className="w-max truncate overflow-hidden px-3">
              <h6 className="text-white/95 truncate text-sm">{music.title}</h6>
              <p className="text-white/75 text-xs">{music.artist}</p>
            </div>
            <div className="w-min">
              <span className="text-white/70">
                <FaBars />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const ControlsBlock = (
    <div className={classnames("h-full flex flex-col space-y-4", showQueue ? "" : "")}>
      {!showQueue && (
        <div className="flex flex-col space-y-3 group">
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
  )

  const queueHeight = (() => {
    if (queueRef.current) {
      return {
        height: queueRef.current.offsetHeight,
        1: queueRef.current.firstElementChild.offsetHeight,
        2: queueRef.current.lastElementChild.offsetHeight,
        result:
          queueRef.current.offsetHeight -
          queueRef.current.firstElementChild.offsetHeight -
          queueRef.current.lastElementChild.offsetHeight,
      }
    }

    return { result: 0 }
  })()

  return (
    <Modal isOpen={isOpen}>
      <div className="relative z-[100] h-screen -top-header w-full">
        <div className="absolute top-0 left-0 w-full h-full">
          <img src={assets.cover.url} alt="cover" className="h-full w-full" />
        </div>
        <div className="h-full  pt-header pb-footer bg-black/20 backdrop-blur-[120px] sm:backdrop-blur-[150px] md:backdrop-blur-[200px] lg:backdrop-blur-[250px] xl:backdrop-blur-[500px] backdrop-brightness-[125%] backdrop-saturate-[150%]">
          <div
            className={classnames(
              "h-full flex flex-col lg:flex-wrap lg:items-center lg:content-end overflow-y-auto px-6 lg:px-10 py-4"
            )}
          >
            <div className="flex flex-col justify-between pr-2">
              <div
                className={classnames(
                  "flex items-center lg:w-2/3",
                  showQueue ? "lg:h-full" : "w-full h-min"
                )}
              >
                {ImageBlock}
                <div
                  className={classnames(
                    showQueue ? "w-3/4" : "w-0 hidden",
                    "transition-all transform-gpu lg:w-0 lg:hidden"
                  )}
                >
                  {TitleBlock}
                </div>
              </div>
              <div
                className={classnames(
                  "lg:w-1/3 xl:px-16 lg:px-10 h-full",
                  showQueue ? "w-full flex flex-col" : "flex flex-col justify-between"
                )}
              >
                <div className={classnames(showQueue ? "hidden lg:block" : "")}>{TitleBlock}</div>
                <div ref={queueRef} className="flex flex-col overflow-hidden h-max py-3">
                  {showQueue && (
                    <div className="flex justify-between items-center pb-3">
                      <div>
                        <h6 className="text-xl text-white/90 mb-0.5">Suivant</h6>
                        <p className="text-base text-white/75">
                          De {queueHeight.height} - {queueHeight["1"]} - {queueHeight["2"]} ={" "}
                          {queueHeight.result}
                        </p>
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
                  )}
                  {showQueue && (
                    <SimpleBar style={{ maxHeight: `${queueHeight.result}px` }}>
                      {QueueBlock}
                    </SimpleBar>
                  )}
                  <div className="h-min py-2">{ControlsBlock}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FullscreenPlayer
