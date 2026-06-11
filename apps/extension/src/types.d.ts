/// <reference types="react" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  type ComponentWithChild = React.FC<{ children: React.ReactNode }>
  type ComponentWithOptionalChild = React.FC<{ children?: React.ReactNode }>
}

export {}
