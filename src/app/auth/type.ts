import { z } from "zod";

export const authSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

export type AuthSchema = z.infer<typeof authSchema>;

export const changePasswordSchema = z.object({
  username: z.string(),
  old_password: z.string().min(6),
  new_password: z.string().min(6),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
