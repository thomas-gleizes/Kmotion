declare type UseLocalQueueResult<T> = {
  queue: T[]
  index: number
  actions: UseLocalActions<T>
  list: T[]
}

declare type UseLocalActions<T> = {
  set: (item: T[], initIndex?: number) => void
  previous: () => void
  next: () => void
  addNext: (item: T) => void
  addLast: (item: T) => void

  shuffle: () => void
}
