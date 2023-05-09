import { ReactElement } from "react"
import { UseQueryResult } from "@tanstack/react-query"

import { useImageLoader } from "../../hooks"

interface LoaderChildProps {
  src: string | undefined
  query: UseQueryResult<string>
}

interface Props {
  id: number
  children: (props: LoaderChildProps) => ReactElement
  fallback?: ReactElement
  enabled?: boolean
}

const ImageLoader: Component<Props> = ({ id, children, fallback, enabled }: Props) => {
  const [querySrc, query] = useImageLoader(id, { enabled })

  if (query.isLoading && fallback) return fallback

  return children({ src: querySrc, query })
}

export default ImageLoader
