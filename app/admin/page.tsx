"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Shield, Users, Activity, AlertCircle, Plus, Pencil, Download, FileText, KeyRound } from "lucide-react"
import { UserDialog } from "@/components/admin/user-dialog"
import { GenerateUserDialog, GenerateConfig } from "@/components/admin/generate-user-dialog"
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/lib/database-types"

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [selectedUserForReset, setSelectedUserForReset] = useState<User | null>(null)
  const { user, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (user.role !== "admin") {
      router.push("/")
      return
    }

    fetchUsers()
  }, [user, router])

  useEffect(() => {
    applyFilters()
  }, [users, searchQuery, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้")
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...users]

    if (searchQuery) {
      filtered = filtered.filter(
        u => 
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter(u => u.role === roleFilter)
    }

    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "true"
      filtered = filtered.filter(u => u.isActive === isActive)
    }

    setFilteredUsers(filtered)
  }

  const toggleUserRole = async (userId: number, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin"
      
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          updates: { role: newRole },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      }

      fetchUsers()
    } catch (error) {
      console.error("Error updating user role:", error)
      alert("เกิดข้อผิดพลาดในการอัพเดท role")
    }
  }

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          updates: { isActive: !currentStatus },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user status")
      }

      fetchUsers()
    } catch (error) {
      console.error("Error updating user status:", error)
      alert("เกิดข้อผิดพลาดในการอัพเดทสถานะ")
    }
  }

  const deleteUser = async (userId: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete user")
      }

      fetchUsers()
    } catch (error: any) {
      console.error("Error deleting user:", error)
      alert(error.message || "เกิดข้อผิดพลาดในการลบผู้ใช้")
    }
  }

  const handleCreateUser = () => {
    setDialogMode("create")
    setSelectedUser(null)
    setDialogOpen(true)
  }

  const handleEditUser = (u: User) => {
    setDialogMode("edit")
    setSelectedUser(u)
    setDialogOpen(true)
  }

  const handleSaveUser = async (userData: any) => {
    try {
      if (dialogMode === "create") {
        const response = await fetch("/api/admin/users/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to create user")
        }
      } else {
        const updates: any = {
          name: userData.name,
          role: userData.role,
          isActive: userData.isActive,
        }

        if (userData.password) {
          const hashPassword = await import("@/lib/auth/hash").then(m => m.hashPassword)
          updates.passwordHash = await hashPassword(userData.password)
        }

        const response = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedUser?.id,
            updates,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to update user")
        }
      }

      fetchUsers()
    } catch (error: any) {
      throw error
    }
  }

  const handleGenerateUsers = async (config: GenerateConfig) => {
    try {
      const response = await fetch("/api/admin/users/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate users")
      }

      const data = await response.json()
      
      const csvContent = [
        ["ID", "ชื่อ", "อีเมล", "Role", "รหัสผ่าน"],
        ...data.users.map((u: any) => [u.id, u.name, u.email, u.role, config.password]),
      ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n")

      const csvBlob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
      const csvUrl = URL.createObjectURL(csvBlob)
      const link = document.createElement("a")
      link.href = csvUrl
      link.download = `generated-users-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(csvUrl)

      alert(`สร้างผู้ใช้สำเร็จ ${config.count} ราย และดาวน์โหลดไฟล์ CSV แล้ว`)
      fetchUsers()
    } catch (error: any) {
      throw error
    }
  }

  const handleExportUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (roleFilter && roleFilter !== "all") params.append("role", roleFilter)
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/admin/users/export?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to export users")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `users-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error: any) {
      alert(error.message || "เกิดข้อผิดพลาดในการส่งออกข้อมูล")
    }
  }

  const handleResetPassword = () => {
    setResetDialogOpen(true)
  }

  const handleResetPasswordConfirm = async (userId: number, newPassword: string) => {
    try {
      const response = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, newPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to reset password")
      }

      alert("รีเซ็ตรหัสผ่านสำเร็จ")
      fetchUsers()
    } catch (error: any) {
      throw error
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      </PageContainer>
    )
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    adminUsers: users.filter(u => u.role === "admin").length,
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-indigo-500" />
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-600">จัดการผู้ใช้ในระบบ</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ที่ใช้งานอยู่</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ดูแลระบบ</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.adminUsers}</div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-2 p-4 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row items-center justify-between">
                <CardTitle>รายชื่อผู้ใช้</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleCreateUser} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มผู้ใช้
                  </Button>
                  <Button onClick={() => setGenerateDialogOpen(true)} size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    สร้างผู้ใช้จำนวนมาก
                  </Button>
                  <Button onClick={handleExportUsers} size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    ส่งออก CSV
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="ค้นหาชื่อหรืออีเมล..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="กรองตาม Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="กรองตามสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {filteredUsers.length !== users.length && (
                <div className="text-sm text-gray-600">
                  แสดงผล {filteredUsers.length} จาก {users.length} ราย
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">ชื่อ</th>
                    <th className="text-left p-2">อีเมล</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Level</th>
                    <th className="text-left p-2">XP</th>
                    <th className="text-left p-2">สถานะ</th>
                    <th className="text-left p-2">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{u.id}</td>
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">
                        <Badge
                          variant={u.role === "admin" ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => toggleUserRole(u.id, u.role || "user")}
                        >
                          {u.role === "admin" ? "Admin" : "User"}
                        </Badge>
                      </td>
                      <td className="p-2">{u.level}</td>
                      <td className="p-2">{u.totalXp}</td>
                      <td className="p-2">
                        <Badge
                          variant={u.isActive ? "default" : "secondary"}
                          className={u.isActive ? "bg-green-500" : "bg-gray-400"}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(u)}
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            แก้ไข
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUserForReset(u)
                              handleResetPassword()
                            }}
                          >
                            <KeyRound className="h-3 w-3 mr-1" />
                            รีเซ็ตรหัสผ่าน
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserStatus(u.id, u.isActive || false)}
                          >
                            {u.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                          </Button>
                          {u.id !== user?.id && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteUser(u.id)}
                            >
                              ลบ
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <UserDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          mode={dialogMode}
        />

        <GenerateUserDialog
          open={generateDialogOpen}
          onClose={() => setGenerateDialogOpen(false)}
          onGenerate={handleGenerateUsers}
        />

        {selectedUserForReset && (
          <ResetPasswordDialog
            open={resetDialogOpen}
            onClose={() => {
              setResetDialogOpen(false)
              setSelectedUserForReset(null)
            }}
            onReset={handleResetPasswordConfirm}
            userId={selectedUserForReset.id}
            userName={selectedUserForReset.name}
          />
        )}
      </div>
    </PageContainer>
  )
}

