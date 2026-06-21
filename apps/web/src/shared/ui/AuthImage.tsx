import { css, cx } from "styled-system/css"
import { useAuthedBlobUrl } from "@/shared/hooks/useAuthedBlobUrl"

const placeholder = css({
  backgroundColor: "surfaceRaised",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "textTertiary",
  fontSize: "24px",
  width: "100%",
  height: "100%",
})

const imageStyle = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  animation: "fadeIn token(durations.normal) token(easings.apple)",
})

type Props = {
  path: string | null
  alt: string
  className?: string
}

export function AuthImage({ path, alt, className }: Props) {
  const { url, error } = useAuthedBlobUrl(path)

  if (!url || error) {
    return (
      <div className={cx(placeholder, className)} aria-label={alt}>
        ♪
      </div>
    )
  }
  return <img src={url} alt={alt} className={cx(imageStyle, className)} draggable={false} />
}
