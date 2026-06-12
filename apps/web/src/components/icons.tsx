type IconProps = { size?: number; className?: string }

function Icon({ size = 20, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const PlayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l11.2-6.86a1.03 1.03 0 0 0 0-1.76L9.56 4.26A1.03 1.03 0 0 0 8 5.14Z" />
  </Icon>
)

export const PauseIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="6" y="4" width="4.5" height="16" rx="1.2" />
    <rect x="13.5" y="4" width="4.5" height="16" rx="1.2" />
  </Icon>
)

export const NextIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 5.7v12.6c0 .74.8 1.2 1.44.81L16 13.5v4.4c0 .61.5 1.1 1.1 1.1h1.3c.6 0 1.1-.49 1.1-1.1V6.1c0-.61-.5-1.1-1.1-1.1h-1.3c-.6 0-1.1.49-1.1 1.1v4.4L6.44 4.89A.94.94 0 0 0 5 5.7Z" />
  </Icon>
)

export const PrevIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 5.7v12.6c0 .74-.8 1.2-1.44.81L8 13.5v4.4c0 .61-.5 1.1-1.1 1.1H5.6c-.6 0-1.1-.49-1.1-1.1V6.1C4.5 5.49 5 5 5.6 5h1.3C7.5 5 8 5.49 8 6.1v4.4l9.56-5.61A.94.94 0 0 1 19 5.7Z" />
  </Icon>
)

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <path
      fillRule="evenodd"
      d="M10.5 3a7.5 7.5 0 1 0 4.55 13.46l4.24 4.25a1.1 1.1 0 0 0 1.56-1.56l-4.25-4.24A7.5 7.5 0 0 0 10.5 3Zm-5.3 7.5a5.3 5.3 0 1 1 10.6 0 5.3 5.3 0 0 1-10.6 0Z"
    />
  </Icon>
)

export const MusicNoteIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 19.5a3 3 0 1 1-2-2.83V6.2c0-.5.36-.92.85-1L19.1 3.02A1 1 0 0 1 20.25 4v11.55a3 3 0 1 1-2-2.83V7.4L9 8.9v10.6Z" />
  </Icon>
)

export const ListIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6.5A1.5 1.5 0 1 1 4 9.5a1.5 1.5 0 0 1 0-3Zm5 .25h11a1.25 1.25 0 1 1 0 2.5H9a1.25 1.25 0 1 1 0-2.5ZM4 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm5 .25h11a1.25 1.25 0 1 1 0 2.5H9a1.25 1.25 0 1 1 0-2.5ZM4 14.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm5 .25h11a1.25 1.25 0 1 1 0 2.5H9a1.25 1.25 0 1 1 0-2.5Z" />
  </Icon>
)

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4c.66 0 1.2.54 1.2 1.2v5.6h5.6a1.2 1.2 0 1 1 0 2.4h-5.6v5.6a1.2 1.2 0 1 1-2.4 0v-5.6H5.2a1.2 1.2 0 1 1 0-2.4h5.6V5.2c0-.66.54-1.2 1.2-1.2Z" />
  </Icon>
)

export const PersonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 11c4.42 0 8 2.24 8 5v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1c0-2.76 3.58-5 8-5Z" />
  </Icon>
)

export const SyncIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5.5V2.8L8.4 6.4 12 10V7.5a4.5 4.5 0 1 1-4.4 5.4H5.5A6.5 6.5 0 1 0 12 5.5Z" />
  </Icon>
)

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.2 4.8 5v6.1c0 4.4 3 8.5 7.2 9.7 4.2-1.2 7.2-5.3 7.2-9.7V5L12 2.2Zm-1 12.4-2.9-2.9 1.4-1.4 1.5 1.5 3.9-3.9 1.4 1.4-5.3 5.3Z" />
  </Icon>
)

export const EditIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 15.6V20h4.4L19.8 8.6l-4.4-4.4L4 15.6Zm17.7-10.3a1.2 1.2 0 0 0 0-1.7l-2.3-2.3a1.2 1.2 0 0 0-1.7 0l-1.8 1.8 4 4 1.8-1.8Z" />
  </Icon>
)

export const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9.5 3.5A1.5 1.5 0 0 1 11 2h2a1.5 1.5 0 0 1 1.5 1.5V4H19a1 1 0 1 1 0 2h-.55l-.86 13.07A2 2 0 0 1 15.6 21H8.4a2 2 0 0 1-2-1.93L5.55 6H5a1 1 0 0 1 0-2h4.5v-.5ZM10 9a.9.9 0 0 1 .9.9v7.2a.9.9 0 1 1-1.8 0V9.9A.9.9 0 0 1 10 9Zm4 0a.9.9 0 0 1 .9.9v7.2a.9.9 0 1 1-1.8 0V9.9A.9.9 0 0 1 14 9Z" />
  </Icon>
)

export const ChevronUpIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 8.3 5.7 14.6a1.1 1.1 0 0 0 1.56 1.55L12 11.4l4.74 4.74a1.1 1.1 0 0 0 1.56-1.55L12 8.3Z" />
  </Icon>
)

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 15.7 5.7 9.4a1.1 1.1 0 0 1 1.56-1.55L12 12.6l4.74-4.74a1.1 1.1 0 0 1 1.56 1.55L12 15.7Z" />
  </Icon>
)

export const VolumeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 9.5A1.5 1.5 0 0 1 5.5 8h2.3l4.4-3.52A1 1 0 0 1 13.8 5.2v13.6a1 1 0 0 1-1.6.78L7.8 16H5.5A1.5 1.5 0 0 1 4 14.5v-5Zm13.6-2.66a1 1 0 0 1 1.4.2 8.3 8.3 0 0 1 0 9.92 1 1 0 0 1-1.6-1.2 6.3 6.3 0 0 0 0-7.52 1 1 0 0 1 .2-1.4Z" />
  </Icon>
)

export const SpinnerIcon = (p: IconProps) => (
  <Icon {...p}>
    <path
      d="M12 3a9 9 0 1 0 9 9 1.1 1.1 0 1 0-2.2 0A6.8 6.8 0 1 1 12 5.2 1.1 1.1 0 1 0 12 3Z"
      style={{ transformOrigin: "center", animation: "spin 0.9s linear infinite" }}
    />
  </Icon>
)

function StrokeIcon({ size = 20, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const ShuffleIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </StrokeIcon>
)

export const RepeatIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </StrokeIcon>
)

export const CheckIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <polyline points="20 6 9 17 4 12" />
  </StrokeIcon>
)
