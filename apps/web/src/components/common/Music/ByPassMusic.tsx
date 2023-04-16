import React from "react"
import { Navigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../utils/Api"
import classnames from "classnames"
import {
  FaBackward,
  FaEllipsisH,
  FaForward,
  FaListUl,
  FaPause,
  FaPlay,
  FaRandom,
  FaSpinner,
  FaVolumeDown,
  FaVolumeUp,
} from "react-icons/all"
import Slider from "../Slider"
import { roundMinMax } from "../../../utils/number"
import { formatTime } from "../../../utils/time"
import { IMusic } from "../../../../../../packages/types"
import { useAudio } from "react-use"

interface Props {
  token: string
}

const ByPassMusic: Component<Props> = ({ token }) => {
  const query = useQuery({
    queryKey: ["music", token],
    queryFn: () =>
      api.bypassMusic(token).then((data) => ({
        music: data.music,
        cover: `data:image/jpeg;base64,${data.cover}`,
        song: `data:audio/mpeg;base64,${data.song}`,
      })),
    retry: false,
  })

  if (query.isError) return <Navigate to="/" />
  if (query.isLoading)
    return (
      <div className="text-8xl text-primary animate-spin">
        <FaSpinner />
      </div>
    )

  return (
    <Player music={query.data.music} assets={{ cover: query.data.cover, song: query.data.song }} />
  )
}

interface PlayerProps {
  music: IMusic
  assets: { cover: string; song: string }
}

const Player: Component<PlayerProps> = ({ music, assets }) => {
  const [audio, state, controls] = useAudio(<audio src={assets.song} autoPlay={true} />)

  const TitleBlock = (
    <div className="flex justify-between items-center">
      <div className="w-full overflow-hidden whitespace-nowrap">
        <h3
          className={classnames(
            "text-white text-lg lg:text-xl xl:text-3xl font-semibold capitalize py-1.5 inline-block whitespace-nowrap",
            { "overflow-defilement": false }
          )}
        >
          {music.title}
        </h3>
        <p className="text-white/80 text-base lg:text-lg xl:text-xl py-1.5 leading-[0.5rem]">
          {music.artist}
        </p>
      </div>
      <div className="flex justify-end items-center pl-3">
        <div className="cursor-pointer bg-white/40 rounded-full p-2">
          <FaEllipsisH className="text-white text-lg lg:text-2xl" />
        </div>
      </div>
    </div>
  )

  const ImageBlock = (
    <div
      className={
        "flex items-center transition-all duration-300 h-full lg:px-16 w-full lg:flex-col lg:justify-center"
      }
    >
      {false ? (
        <div className="rounded-md bg-gray-200 animate-pulse w-fit">
          <img
            className="rounded-lg w-full transform opacity-0 transition-all duration-300 lg:rounded-2xl shadow-2xl select-none"
            src="/images/placeholder.png"
            alt={`cover of ${music.title}`}
          />
        </div>
      ) : (
        <img
          src={assets.cover}
          alt={music.title}
          className={classnames(
            "rounded-lg w-full transform transition-all duration-300 lg:rounded-2xl shadow-2xl select-none",
            { "scale-[75%] shadow-lg": state.paused }
          )}
        />
      )}
    </div>
  )
  return (
    <>
      {audio}
      <div className="relative z-[100] h-screen -top-header w-full">
        <div className="absolute top-0 left-0 w-full h-full">
          <img src={assets.cover} alt="cover" className="h-full w-full" />
        </div>
        <div className="h-full pt-header pb-footer bg-black/20 backdrop-blur-[150px] lg:backdrop-blur-[500px] backdrop-brightness-[125%] backdrop-saturate-[150%]">
          <div className={"h-full px-6 lg:px-10 py-4"}>
            <div className="h-full flex flex-col lg:flex-row justify-evenly lg:items-center">
              <div className={"flex items-center lg:w-2/3 w-full h-min"}>
                {ImageBlock}
                <div className={"transition-all transform-gpu lg:w-0 lg:hidden w-O hidden"}>
                  {TitleBlock}
                </div>
              </div>
              <div
                className={
                  "flex flex-col justify-between lg:justify-center lg:w-1/3 xl:px-5 lg:px-5"
                }
              >
                <div className="">{TitleBlock}</div>
                <div className="flex flex-col justify-center h-full py-3">
                  <div className="h-min py-2">
                    <div className={"h-full flex flex-col space-y-5"}>
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
                          <i className="rounded-full">
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
                          <i className="rounded-full">
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
                          className={
                            "text-white rounded-full text-xl lg:text-2xl transition transform duration-200"
                          }
                        >
                          <FaRandom />
                        </i>
                        <i
                          className={
                            "text-white rounded-full text-xl lg:text-2xl transition transform duration-200"
                          }
                        >
                          <FaRandom />
                        </i>
                        <i
                          className={
                            "text-white text-opacity-50 duration-200 rounded-full text-xl lg:text-2xl transition transform duration-200"
                          }
                        >
                          <FaListUl />
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ByPassMusic
