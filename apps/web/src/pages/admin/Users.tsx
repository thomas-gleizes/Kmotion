import UserList from "../../components/admin/Users/UserList"

const AdminUsers: Page = () => {
  return (
    <div className="p-5">
      admin users page
      <div className="card">
        <div className="card-body">
          <UserList />
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
