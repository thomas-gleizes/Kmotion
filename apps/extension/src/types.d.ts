/// <reference types="react" />

declare global {
  type ComponentWithChild = React.FC<{ children: React.ReactNode }>
  type ComponentWithOptionalChild = React.FC<{ children?: React.ReactNode }>
}

export {}

