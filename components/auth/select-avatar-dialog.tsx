"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import Image from "next/image"

interface SelectAvatarDialogProps {
  open: boolean
  onClose: () => void
  onSelectAvatar: (avatar: string) => Promise<void>
}

// List of available avatars
const AVAILABLE_AVATARS = Array.from({ length: 9 }, (_, i) => `/images/avatars/avatar-${i + 1}.png`)

export function SelectAvatarDialog({ open, onClose, onSelectAvatar }: SelectAvatarDialogProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedAvatar) {
      setError("กรุณาเลือกรูปโปรไฟล์")
      return
    }

    setIsLoading(true)
    try {
      await onSelectAvatar(selectedAvatar)
      onClose()
      setSelectedAvatar("")
    } catch (error: any) {
      setError(error.message || "เกิดข้อผิดพลาด")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedAvatar("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            เลือกรูปโปรไฟล์
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
            {AVAILABLE_AVATARS.map((avatar) => (
              <button
                key={avatar}
                type="button"
                onClick={() => setSelectedAvatar(avatar)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedAvatar === avatar
                    ? "border-indigo-500 ring-2 ring-indigo-200"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <Image
                  src={avatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading || !selectedAvatar}>
              {isLoading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

