import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร").max(100, "ชื่อต้องไม่เกิน 100 ตัวอักษร"),
  email: z.string().email("กรุณาใส่อีเมลที่ถูกต้อง"),
  password: z
    .string()
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .max(100, "รหัสผ่านต้องไม่เกิน 100 ตัวอักษร"),
})

export const loginSchema = z.object({
  email: z.string().email("กรุณาใส่อีเมลที่ถูกต้อง"),
  password: z.string().min(1, "กรุณาใส่รหัสผ่าน"),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "กรุณาใส่รหัสผ่านปัจจุบัน"),
  newPassword: z
    .string()
    .min(6, "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร")
    .max(100, "รหัสผ่านต้องไม่เกิน 100 ตัวอักษร"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

