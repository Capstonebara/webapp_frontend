import { z } from "zod";

export const authSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

export type AuthSchema = z.infer<typeof authSchema>;
