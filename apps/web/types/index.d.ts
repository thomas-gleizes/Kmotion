declare type Component<Props = unknown> = React.FC<Props>
declare type ReactNode = React.ReactNode
declare type Page = Component<Record<string, never>>
declare type ComponentWithChild<Props = unknown> = Component<{ children: ReactNode } & Props>

declare type FetcherRequest = {
  path: string
  init?: RequestInit
}

declare type FetcherResponse = Response

declare type RequestInterceptor = (request: FetcherRequest) => FetcherRequest
declare type ResponseInterceptor = (
  response: FetcherResponse,
  request: FetcherRequest
) => FetcherResponse

declare type ModalComponent<Props = unknown, Result = unknown> = Component<
  { isOpen: boolean; close: (r: Result) => void } & Props
>

declare type ModalType<Result = unknown> = {
  uid: string
  component: React.ReactElement
  resolve: (result: Result) => void
}
