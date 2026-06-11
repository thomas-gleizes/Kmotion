import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
})

export type LoginDto = z.infer<typeof loginSchema>
