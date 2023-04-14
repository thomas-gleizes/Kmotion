import { useMemo, useRef, useState } from "react"
import { useList } from "react-use"
import useLocalStorageState from "use-local-storage-state"
import { IMusic } from "@kmotion/types"

export function useStorageQueue(): UseStorageQueueResult<IMusic> {
  const [index, setIndex] = useLocalStorageState<number>("iindex", {
    defaultValue: 0,
  })
  const [storageQueue, setStorageQueue] = useLocalStorageState<IMusic[]>("iqueue", {
    defaultValue: [],
  })

  const savePlaylistRef = useRef<IMusic[]>([...storageQueue])

  const [isShuffled, setIsShuffled] = useState<boolean>(false)

  const [list, listActions] = useList<IMusic>([...storageQueue])

  const queue = useMemo(() => {
    const queue = [...list]
    queue.splice(0, index)
    return queue
  }, [list, index])

  function insertAt(item: IMusic, index: number): IMusic[] {
    // Si l'index est inférieur à 0, on l'ajuste à 0.
    if (index < 0) index = 0
    // Si l'index est supérieur ou égal à la longueur du tableau, on l'ajuste à la fin du tableau.
    if (index >= list.length) index = list.length
    // Insère l'élément à l'index spécifié.
    list.splice(index, 0, item)
    // Retourne le tableau modifié.
    return list
  }

  const actions: UseStorageQueueActions<IMusic> = {
    set: function (items: IMusic[], initIndex?: number) {
      listActions.set([...items])
      setStorageQueue([...items])
      savePlaylistRef.current = [...items]

      if (initIndex === undefined) return setIndex(0)
      else if (initIndex < 0) return setIndex(0)
      else if (initIndex >= items.length) return setIndex(items.length - 1)
      else setIndex(initIndex)

      setIsShuffled(false)
    },
    previous: function () {
      if (index > 0) setIndex(index - 1)
      else setIndex(list.length - 1)
    },
    next: function () {
      if (index < list.length - 1) setIndex(index + 1)
      else setIndex(0)
    },
    addNext: function (item: IMusic) {
      const newList = insertAt(item, index + 1)
      listActions.set([...newList])
      setStorageQueue([...newList])
      savePlaylistRef.current = [...newList]
    },
    addLast: function (item: IMusic) {
      const newList = [...list, item]
      listActions.set([...newList])
      setStorageQueue([...newList])
      savePlaylistRef.current = [...newList]
    },
    remove: function (i: number) {
      const newList = [...list]
      newList.splice(i, 1)
      listActions.set([...newList])
      setStorageQueue([...newList])
      savePlaylistRef.current = [...newList]
    },
    findIndex: function (item: IMusic): number {
      return queue.findIndex((i) => i.id === item.id)
    },
    shuffle: function (i: number = index) {
      if (isShuffled) {
        setStorageQueue([...savePlaylistRef.current])
        listActions.set([...savePlaylistRef.current])
      } else {
        const begin = [...list].slice(0, i) as IMusic[]
        const current = list.at(i) as IMusic
        const end = [...list].slice(i + 1).sort(() => Math.random() - 0.5) as IMusic[]

        setStorageQueue([current, ...end.sort(() => Math.random() - 0.5)])
        listActions.set([...begin, current, ...end])
      }

      setIsShuffled(!isShuffled)
    },
    go: function (destIndex: number) {
      if (index + destIndex < 0) return setIndex(0)
      else if (index + destIndex >= list.length) return setIndex(list.length - 1)
      else return setIndex(index + destIndex)
    },
  }

  return { queue, index, actions, list, isShuffled }
}
