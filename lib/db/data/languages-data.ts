// ไฟล์นี้เก็บข้อมูลภาษาต่างๆ
import type { Language } from "../../database-types"

export const languages: Language[] = [
  { id: 1, name: "English", code: "en", icon: "🇬🇧" },
  { id: 2, name: "Thai", code: "th", icon: "🇹🇭" },
  { id: 3, name: "Chinese", code: "zh", icon: "🇨🇳" },
  { id: 4, name: "Italian", code: "it", icon: "🇮🇹" },
  { id: 5, name: "Japanese", code: "ja", icon: "🇯🇵" },
  { id: 6, name: "Korean", code: "ko", icon: "🇰🇷" },
]
