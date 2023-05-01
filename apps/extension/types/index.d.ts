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

declare type ConvertVideoStatus = "stand-by" | "loading" | "success" | "error"

declare type VideoData = Record<
  string,
  {
    status: ConvertVideoStatus
    data: any | null
  }
>
