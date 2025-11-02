"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"

interface EditNameDialogProps {
  open: boolean
  onClose: () => void
  onUpdateName: (newName: string) => Promise<void>
  currentName: string
}

export function EditNameDialog({ open, onClose, onUpdateName, currentName }: EditNameDialogProps) {
  const [name, setName] = useState(currentName)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // อัปเดต name เมื่อ dialog เปิด
  useEffect(() => {
    if (open) {
      setName(currentName)
      setError("")
    }
  }, [open, currentName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || name.trim().length === 0) {
      setError("กรุณากรอกชื่อ")
      return
    }

    if (name.trim().length < 2) {
      setError("ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
      return
    }

    if (name.trim() === currentName) {
      setError("ชื่อใหม่ต้องแตกต่างจากชื่อเดิม")
      return
    }

    setIsLoading(true)
    try {
      await onUpdateName(name.trim())
      onClose()
    } catch (error: any) {
      setError(error.message || "เกิดข้อผิดพลาด")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setName(currentName)
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            แก้ไขชื่อโปรไฟล์
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อ</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรุณาระบุชื่อ"
              required
              maxLength={100}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading || name.trim() === currentName}>
              {isLoading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

