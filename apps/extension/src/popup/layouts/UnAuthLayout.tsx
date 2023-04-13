import React from "react"

const UnAuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="h-full w-full">{children}</div>
}

export default UnAuthLayout
