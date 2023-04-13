import React from "react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import SimpleBar from "simplebar-react"

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="px-1">
        <SimpleBar className="max-h-[500px]">
          <div className="py-2 pr-2">{children}</div>
        </SimpleBar>
      </main>
      <Footer />
    </>
  )
}

export default AuthLayout
