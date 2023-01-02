import { useForm } from "react-hook-form"
import { RegisterSchema } from "schemas/auth"

interface Schema extends RegisterSchema {
  confirmPassword: string
}

const RegisterPage: Component = () => {
  const { register, handleSubmit } = useForm<Schema>({
    defaultValues: { email: "", name: "", password: "" }
  })

  return (
    <div>
      <h2>Demande d'inscription</h2>
    </div>
  )
}

export default RegisterPage
