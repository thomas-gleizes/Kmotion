import React from "react"
import classnames from "classnames"
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

interface SubMenuProps {
  links: Link[]
  name: string
}

const SubMenu: Component<SubMenuProps> = ({ links, name }) => {
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

interface AdminSidebarProps {
  extend: { value: boolean; toggle: () => void }
}

const AdminSidebar: Component<AdminSidebarProps> = ({ extend }) => {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="">
        <div className="flex items-center justify-between pb-2">
          <div onClick={extend.toggle}>
            <FaBars className="text-3xl" />
          </div>
          {extend.value && (
            <div className="text-3xl w-full text-center">
              <h3 onClick={extend.toggle}>K'motion</h3>
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
  )
}

export default AdminSidebar
