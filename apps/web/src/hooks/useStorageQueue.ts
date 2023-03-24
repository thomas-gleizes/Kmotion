import { useMemo } from "react"
import { useList } from "react-use"
import useLocalStorageState from "use-local-storage-state"

export function useStorageQueue<Item>(): UseStorageQueueResult<Item> {
  const [index, setIndex] = useLocalStorageState<number>("iindex", {
    defaultValue: 0,
  })
  const [storageQueue, setStorageQueue] = useLocalStorageState<Item[]>("iqueue", {
    defaultValue: [],
  })

  const [list, listActions] = useList<Item>(storageQueue)

  const queue = useMemo(() => {
    const queue = [...list]
    queue.splice(0, index)
    return queue
  }, [list, index])

  function insertAt(item: Item, index: number): Item[] {
    // Si l'index est inférieur à 0, on l'ajuste à 0.
    if (index < 0) index = 0
    // Si l'index est supérieur ou égal à la longueur du tableau, on l'ajuste à la fin du tableau.
    if (index >= list.length) index = list.length
    // Insère l'élément à l'index spécifié.
    list.splice(index, 0, item)
    // Retourne le tableau modifié.
    return list
  }

  const actions: UseStorageQueueActions<Item> = {
    set: (items: Item[], initIndex?: number) => {
      listActions.set([...items])
      setStorageQueue([...items])
      if (initIndex === undefined) return setIndex(0)
      else if (initIndex < 0) return setIndex(0)
      else if (initIndex >= items.length) return setIndex(items.length - 1)
      else setIndex(initIndex)
    },
    previous: () => {
      if (index > 0) setIndex(index - 1)
      else setIndex(list.length - 1)
    },
    next: () => {
      if (index < list.length - 1) setIndex(index + 1)
      else setIndex(0)
    },
    addNext: (item: Item) => {
      const newList = insertAt(item, index + 1)
      listActions.set([...newList])
      setStorageQueue([...newList])
    },
    addLast: (item: Item) => {
      const newList = [...list, item]
      listActions.set([...newList])
      setStorageQueue([...newList])
    },
    shuffle: () => {
      const shuffledList = list.sort(() => Math.random() - 0.5)
      setStorageQueue([...shuffledList])
      listActions.set([...shuffledList])
    },
    go: (destIndex: number) => {
      if (index + destIndex < 0) return setIndex(0)
      else if (index + destIndex >= list.length) return setIndex(list.length - 1)
      else return setIndex(index + destIndex)
    },
  }

  return { queue, index, actions, list }
}
