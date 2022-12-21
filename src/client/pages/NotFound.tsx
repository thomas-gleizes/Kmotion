import { Link } from "react-router-dom"

const NotFound: Component = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center space-y-3">
      <div>
        <h1>Error - 404 not found </h1>
      </div>
      <div>
        <Link
          to="/"
          className="bg-gradient-to-br from-blue-700 to-blue-800 px-3 py-1 text-white font-semibold rounded shadow-md transition transform hover:scale-105 hover:shadow-xl"
        >
          Retour a l'accueille
        </Link>
      </div>
    </div>
  )
}

export default NotFound