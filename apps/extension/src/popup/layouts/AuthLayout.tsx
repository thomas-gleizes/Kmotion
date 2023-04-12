import React from "react"
import Header from "../components/common/Header"
import Footer from "../components/common/Footer"

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="pt-header pb-footer bg-black h-full text-white">{children}</main>
      <Footer />
    </>
  )
}

export default AuthLayout
