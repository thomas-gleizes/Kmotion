import { ReactElement } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { useImageLoader } from "../../hooks/useImageLoader"

interface LoaderChildProps {
  src: string
  query: UseQueryResult<string>
}

interface Props {
  src?: string
  children: (props: LoaderChildProps) => ReactElement
}

const ImageLoader: Component<Props> = ({ src, children }: Props) => {
  const [querySrc, query] = useImageLoader(src)

  return children({ src: querySrc, query })
}

export default ImageLoader
