import React from "react"

import UserList from "../../components/admin/Users/UserList"

const AdminUsers: Page = () => {
  return (
    <div className="pb-24">
      <div className="pb-4">
        <h1 className="text-center text-3xl">Admin musics page</h1>
      </div>
      <UserList />
    </div>
  )
}

export default AdminUsers
