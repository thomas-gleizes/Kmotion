declare type Component<Props = unknown> = React.FC<Props>
declare type ReactNode = React.ReactNode
declare type Page = Component<Record<string, never>>
declare type ComponentWithChild<Props = unknown> = Component<{ children: ReactNode } & Props>
declare type ModalComponent<Props = unknown> = Component<
  { isOpen: boolean; close: () => void } & Props
>
