"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

interface GenerateUserDialogProps {
  open: boolean
  onClose: () => void
  onGenerate: (config: GenerateConfig) => Promise<void>
}

export interface GenerateConfig {
  count: number
  prefix: string
  domain: string
  password: string
}

export function GenerateUserDialog({ open, onClose, onGenerate }: GenerateUserDialogProps) {
  const [formData, setFormData] = useState({
    count: "10",
    prefix: "user",
    domain: "example.com",
    password: "Password123",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const count = parseInt(formData.count)
    if (count < 1 || count > 1000) {
      setError("จำนวนผู้ใช้ต้องอยู่ระหว่าง 1-1000")
      return
    }

    setIsLoading(true)
    try {
      await onGenerate({
        count,
        prefix: formData.prefix,
        domain: formData.domain,
        password: formData.password,
      })
      onClose()
      setFormData({
        count: "10",
        prefix: "user",
        domain: "example.com",
        password: "Password123",
      })
    } catch (error: any) {
      setError(error.message || "เกิดข้อผิดพลาด")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>สร้างผู้ใช้จำนวนมาก</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="count">จำนวนผู้ใช้ (1-1000)</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="1000"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prefix">Prefix</Label>
            <Input
              id="prefix"
              value={formData.prefix}
              onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              placeholder="เช่น user, student"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain อีเมล</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="เช่น example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน (ใช้เหมือนกันทุกคน)</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
            <p className="font-semibold mb-1">ตัวอย่าง:</p>
            <p>
              จำนวน: {formData.count || "10"} ราย
              <br />
              อีเมล: {formData.prefix || "user"}1@{formData.domain || "example.com"}, {formData.prefix || "user"}2@{formData.domain || "example.com"}, ...
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "กำลังสร้าง..." : "สร้างผู้ใช้"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

