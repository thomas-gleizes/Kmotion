import React, { Fragment, MouseEventHandler, useMemo } from "react"
import { Menu, Transition } from "@headlessui/react"
import classnames from "classnames"
import { FaEllipsisH } from "react-icons/all"

import { IMusic } from "@kmotion/types"
import { useIsDisplay } from "../../../hooks"
import { randomMinMax } from "../../../utils/number"
import FallbackImage from "../FallbackImage"
import ImageLoader from "../ImageLoader"
import MusicSkeleton from "./MusicSkeleton"

type ClickFunction = (
  music: IMusic,
  index: number,
  event: React.MouseEvent<Element, MouseEvent>
) => void

type Action = {
  label: string | JSX.Element
  icon?: JSX.Element
  className?: string | Record<string, boolean>
  onClick: ClickFunction
}

interface Props {
  musics: IMusic[]
  loading: boolean
  onClick: ClickFunction
  actions: Action[][]
}

export const MusicsList: Component<Props> = ({ musics, loading, onClick, actions }) => {
  const randomLength = useMemo(() => randomMinMax(40, 98), [])

  return (
    <div className="space-y-2">
      {!loading ? (
        musics.length ? (
          musics.map((music, index) => (
            <MusicItem
              key={index}
              music={music}
              onClick={(event) => onClick(music, index, event)}
              actions={actions}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="italic font-semibold text-primary">Aucune music trouvée ...</p>
          </div>
        )
      ) : (
        Array.from({ length: randomLength }, (_, index) => <MusicSkeleton key={index} />)
      )}
    </div>
  )
}

interface MusicItemProps {
  music: IMusic
  onClick: MouseEventHandler
  actions: Action[][]
  actionCLick?: ClickFunction
}

export const MusicItem: Component<MusicItemProps> = ({ music, onClick, actions }) => {
  const [isDisplay, ref] = useIsDisplay<HTMLDivElement>(0.3)

  return (
    <div ref={ref} onClick={onClick} className="cursor-pointer">
      <div className="flex h-full">
        <div className="w-1/5 h-full">
          <ImageLoader enabled={isDisplay} src={music.links.cover} fallback={<FallbackImage />}>
            {({ src }) => <img className="w-full rounded-lg" src={src} alt={music.title} />}
          </ImageLoader>
        </div>
        <div className="w-4/5 pl-3">
          <div className="h-full border-b border-white/50 md:pl-2 flex items-center justify-between">
            <div
              className={classnames(
                actions.length ? "w-[85%]" : "w-full",
                "h-full flex flex-col justify-center"
              )}
            >
              <p className="truncate xl:text-3xl text-white">{music.title}</p>
              <p className="truncate text-sm text-white/70">{music.artist}</p>
            </div>
            {actions.length > 0 && (
              <div className="w-fit">
                <MusicItemActions actions={actions} music={music} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MusicItemActionsProps {
  actions: Action[][]
  music: IMusic
}

export const MusicItemActions: Component<MusicItemActionsProps> = ({ music, actions }) => {
  return (
    <div className="text-center">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            onClick={(event) => event.stopPropagation()}
            className="w-full text-xl md:text-2xl lg:text-4xl text-white/80 hover:text-white/100 hover:bg-white/10 rounded-full p-1 lg:p-2 transition"
          >
            <FaEllipsisH aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-[100000000000] absolute right-0 mt-2 w-56 p-1 origin-top-right divide-y divide-gray-100 rounded-lg bg-secondary/90 backdrop-blur-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {actions.map((group, index) =>
              group.length ? (
                <div key={index} className="py-1">
                  {group.map((action, index) => (
                    <Menu.Item key={index}>
                      <button
                        onClick={(event) => {
                          event.stopPropagation()
                          action.onClick(music, 0, event)
                        }}
                        className={classnames(
                          "w-full px-2 py-1 text-lg font-semibold flex items-center justify-between space-x-2 rounded",
                          action.className
                        )}
                      >
                        <span className="truncate">{action.label}</span>
                        {action.icon}
                      </button>
                    </Menu.Item>
                  ))}
                </div>
              ) : null
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
