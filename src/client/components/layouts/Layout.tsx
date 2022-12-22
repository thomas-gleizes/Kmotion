interface LayoutProps {
  children?: ReactNode
}

const Layout: Component<LayoutProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-black">
      <div className="max-w-[375px] max-h-[560px] w-full h-full relative z-0 border bg-white">
        {children}
      </div>
    </div>
  )
}

export default Layout
