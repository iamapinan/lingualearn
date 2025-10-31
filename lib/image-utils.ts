// ไฟล์นี้ใช้สำหรับจัดการรูปภาพในแอปพลิเคชัน

// รายการหมวดหมู่และรูปภาพที่เกี่ยวข้อง
const categoryImages: Record<string, string> = {
  general: "/images/categories/general.png",
  greetings: "/images/categories/greetings.png",
  family: "/images/categories/family.png",
  food: "/images/categories/food.png",
  animals: "/images/categories/animals.png",
  colors: "/images/categories/colors.png",
  numbers: "/images/categories/numbers.png",
  time: "/images/categories/time.png",
  weather: "/images/categories/weather.png",
  travel: "/images/categories/travel.png",
  shopping: "/images/categories/shopping.png",
  hobbies: "/images/categories/hobbies.png",
  school: "/images/categories/school.png",
  work: "/images/categories/work.png",
  health: "/images/categories/health.png",
  technology: "/images/categories/technology.png",
}

// รายการคำศัพท์และรูปภาพที่เกี่ยวข้อง
const vocabularyImages: Record<string, string> = {
  // คำทักทาย
  hello: "/images/vocabulary/hello.png",
  goodbye: "/images/vocabulary/goodbye.png",
  thankyou: "/images/vocabulary/thankyou.png",
  please: "/images/vocabulary/please.png",

  // ครอบครัว
  mother: "/images/vocabulary/mother.png",
  father: "/images/vocabulary/father.png",
  sister: "/images/vocabulary/sister.png",
  brother: "/images/vocabulary/brother.png",
  family: "/images/vocabulary/family.png",

  // สัตว์
  dog: "/images/vocabulary/dog.png",
  cat: "/images/vocabulary/cat.png",
  bird: "/images/vocabulary/bird.png",
  fish: "/images/vocabulary/fish.png",

  // อาหาร
  apple: "/images/vocabulary/apple.png",
  bread: "/images/vocabulary/bread.png",
  water: "/images/vocabulary/water.png",
  milk: "/images/vocabulary/milk.png",
  food: "/images/vocabulary/food.png",

  // สี
  red: "/images/vocabulary/red.png",
  blue: "/images/vocabulary/blue.png",
  green: "/images/vocabulary/green.png",
  yellow: "/images/vocabulary/yellow.png",

  // ตัวเลข
  one: "/images/vocabulary/one.png",
  two: "/images/vocabulary/two.png",
  three: "/images/vocabulary/three.png",
  four: "/images/vocabulary/four.png",

  // คำศัพท์เพิ่มเติม
  opportunity: "/images/vocabulary/opportunity.png",
  development: "/images/vocabulary/development.png",
  experience: "/images/vocabulary/experience.png",
  technology: "/images/vocabulary/technology.png",
  education: "/images/vocabulary/education.png",
  business: "/images/vocabulary/business.png",
  travel: "/images/vocabulary/travel.png",
  health: "/images/vocabulary/health.png",
  nature: "/images/vocabulary/nature.png",
  communication: "/images/vocabulary/communication.png",
  transportation: "/images/vocabulary/transportation.png",
  entertainment: "/images/vocabulary/entertainment.png",
  shopping: "/images/vocabulary/shopping.png",
}

// ฟังก์ชันสำหรับดึงรูปภาพตามหมวดหมู่
export function getImageForCategory(category: string): string {
  const normalizedCategory = category.toLowerCase().trim()

  // ตรวจสอบว่ามีรูปภาพสำหรับหมวดหมู่นี้หรือไม่
  if (categoryImages[normalizedCategory]) {
    return categoryImages[normalizedCategory]
  }

  // ถ้าไม่มี ให้ใช้รูปภาพทั่วไป
  return categoryImages.general
}

// ฟังก์ชันสำหรับดึงรูปภาพตามคำศัพท์
export function getImageForWord(word: string): string {
  // ทำความสะอาดคำศัพท์ (ลบช่องว่าง, ตัวอักษรพิเศษ, แปลงเป็นตัวพิมพ์เล็ก)
  const normalizedWord = word
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "")

  // ตรวจสอบว่ามีรูปภาพสำหรับคำศัพท์นี้หรือไม่
  if (vocabularyImages[normalizedWord]) {
    return vocabularyImages[normalizedWord]
  }

  // ถ้าไม่มี ให้ใช้รูปภาพทั่วไปตามคำศัพท์
  return `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(word)}`
}
