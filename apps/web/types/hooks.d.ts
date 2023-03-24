declare type UseStorageQueueResult<T> = {
  queue: T[]
  index: number
  actions: UseStorageQueueActions<T>
  list: T[]
}

declare type UseStorageQueueActions<T> = {
  set: (item: T[], initIndex?: number) => void
  previous: () => void
  next: () => void
  addNext: (item: T) => void
  addLast: (item: T) => void
  shuffle: () => void
  go: (destIndex: number) => void
}
