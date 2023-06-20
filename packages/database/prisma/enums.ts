export const BypassCodeType = {
  playlist: "playlist",
  music: "music",
} as const
export type BypassCodeType = (typeof BypassCodeType)[keyof typeof BypassCodeType]
export const Visibility = {
  private: "private",
  public: "public",
} as const
export type Visibility = (typeof Visibility)[keyof typeof Visibility]
