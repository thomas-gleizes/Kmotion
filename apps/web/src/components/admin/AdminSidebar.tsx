import React from "react"
import classnames from "classnames"
import { useToggle } from "react-use"
import { Link, useRouter } from "@tanstack/react-router"
import { FaArrowLeft, FaBars, FaChevronDown, FaMusic, FaUser } from "react-icons/fa"

const links: Record<string, Link[]> = {
  main: [
    {
      path: "/admin/users",
      label: "Users",
      icon: <FaUser className="mr-2" />,
    },
    {
      path: "/admin/musics",
      label: "Musics",
      icon: <FaMusic className="mr-2" />,
    },
  ],
  test: [
    {
      path: "/admin/users",
      label: "Users",
      icon: <FaUser className="mr-2" />,
    },
    {
      path: "/admin/musics",
      label: "Musics",
      icon: <FaMusic className="mr-2" />,
    },
  ],
}

const SideBarLink: Component<{ to: string; children: ReactNode }> = ({ to, children }) => {
  const router = useRouter()

  const active = router.history.location.pathname === to

  return (
    <Link to={to}>
      <span className={classnames("text-xl cursor-pointer", active && "font-bold")}>
        {children}
      </span>
    </Link>
  )
}

type Link = {
  path: string
  label: string
  icon: ReactNode
}

interface Props {
  links: Link[]
  name: string
}

const SubMenu: Component<Props> = ({ links, name }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="text-2xl flex justify-between items-center pb-1">
          <span>{name}</span>
          <span className="text-lg">
            <FaChevronDown />
          </span>
        </div>
        {links.map((link, index) => (
          <SideBarLink key={index} to={link.path}>
            {link.label}
          </SideBarLink>
        ))}
      </div>
    </div>
  )
}

const AdminSidebar: Component = () => {
  const [isExtend, toggleExtend] = useToggle(true)

  return (
    <div
      className={classnames(
        "top-0 py-2 bg-slate-800 text-white border-r-2 h-screen transition-all ease-in-out duration-200 overflow-hidden",
        isExtend ? "w-64 px-4" : "w-12 px-2",
      )}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="">
          <div className="flex items-center justify-between pb-2">
            <div onClick={toggleExtend}>
              <FaBars className="text-3xl" />
            </div>
            {isExtend && (
              <div className="text-3xl w-full text-center">
                <h3 onClick={toggleExtend}>K'motion</h3>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            {Object.entries(links).map(([key, linkGroup], index) => (
              <SubMenu key={index} name={key} links={linkGroup} />
            ))}
          </div>
        </div>
        <div>
          <Link to="/app/playlists">
            <FaArrowLeft />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar
