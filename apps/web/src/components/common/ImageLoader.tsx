import { ReactElement } from "react"
import { UseQueryResult } from "@tanstack/react-query"

import { useImageLoader } from "../../hooks"

interface LoaderChildProps {
  src: string | undefined
  query: UseQueryResult<string>
}

interface Props {
  src?: string
  children: (props: LoaderChildProps) => ReactElement
  fallback?: ReactElement
  enabled?: boolean
}

const ImageLoader: Component<Props> = ({ src, children, fallback, enabled }: Props) => {
  const [querySrc, query] = useImageLoader(src, { enabled })

  if (query.isLoading && fallback) return fallback

  return children({ src: querySrc, query })
}

export default ImageLoader
