declare type UseStorageQueueResult<T> = {
  queue: T[]
  index: number
  actions: UseStorageQueueActions<T>
  list: T[]

  isShuffled: boolean
}

declare type UseStorageQueueActions<T> = {
  set: (item: T[], initIndex?: number) => void
  previous: () => void
  next: () => void
  addNext: (item: T) => void
  addLast: (item: T) => void
  remove: (index: number) => void
  shuffle: () => void
  findIndex: (item: T) => number
  go: (destIndex: number) => void
}
