import { z } from "zod";

// bcrypt only hashes the first 72 bytes of a password, so cap the length there
// rather than silently ignoring the rest.
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

// Shape of the credentials submitted to the Credentials provider's `authorize`.
export const signInSchema = z.object({
  email: z.email("Invalid email"),
  password,
});

// Body of `POST /api/auth/register`.
export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.email("Invalid email"),
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
