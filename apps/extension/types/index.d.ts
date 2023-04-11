declare type Route = {
  name: string
  screen: React.FC
  root: React.FC<LayoutProps>
  needAuth?: boolean
  default?: boolean
}

declare type LayoutProps = {
  children: React.ReactNode
}
