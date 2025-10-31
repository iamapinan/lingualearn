"use client"

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p className="text-lg">ถ้าหน้านี้แสดงได้ แสดงว่า Next.js ทำงานปกติ</p>
      <div className="mt-8 space-y-4">
        <div className="p-4 bg-green-100 border border-green-400 rounded">
          ✅ Next.js is working
        </div>
        <div className="p-4 bg-blue-100 border border-blue-400 rounded">
          ✅ Tailwind CSS is working
        </div>
        <div className="p-4 bg-purple-100 border border-purple-400 rounded">
          ✅ Client-side rendering is working
        </div>
      </div>
    </div>
  )
}

