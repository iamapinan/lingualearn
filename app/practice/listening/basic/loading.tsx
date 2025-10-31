import { PageContainer } from "@/components/page-container"

export default function Loading() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-indigo-600">Loading exercise...</p>
      </div>
    </PageContainer>
  )
}
