import React from "react"
import { FaSpinner } from "react-icons/fa"

const GeneraLoading: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-secondary flex justify-center items-center">
      <FaSpinner className="text-primary text-4xl animate-spin" />
    </div>
  )
}

export default GeneraLoading
