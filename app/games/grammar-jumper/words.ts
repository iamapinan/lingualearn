export type WordCategory = "NOUN" | "VERB" | "ADJECTIVE"

export interface GameWord {
  word: string
  category: WordCategory
  translation: string
}

export const gameWords: GameWord[] = [
  // Nouns
  { word: "House", category: "NOUN", translation: "บ้าน" },
  { word: "Cat", category: "NOUN", translation: "แมว" },
  { word: "Dog", category: "NOUN", translation: "สุนัข" },
  { word: "Tree", category: "NOUN", translation: "ต้นไม้" },
  { word: "Book", category: "NOUN", translation: "หนังสือ" },
  { word: "Car", category: "NOUN", translation: "รถยนต์" },
  { word: "Apple", category: "NOUN", translation: "แอปเปิ้ล" },
  { word: "Sun", category: "NOUN", translation: "ดวงอาทิตย์" },
  { word: "Moon", category: "NOUN", translation: "ดวงจันทร์" },
  { word: "Water", category: "NOUN", translation: "น้ำ" },
  { word: "Friend", category: "NOUN", translation: "เพื่อน" },
  { word: "School", category: "NOUN", translation: "โรงเรียน" },
  { word: "Bird", category: "NOUN", translation: "นก" },
  { word: "Flower", category: "NOUN", translation: "ดอกไม้" },
  { word: "Chair", category: "NOUN", translation: "เก้าอี้" },

  // Verbs
  { word: "Run", category: "VERB", translation: "วิ่ง" },
  { word: "Eat", category: "VERB", translation: "กิน" },
  { word: "Sleep", category: "VERB", translation: "นอน" },
  { word: "Walk", category: "VERB", translation: "เดิน" },
  { word: "Jump", category: "VERB", translation: "กระโดด" },
  { word: "Read", category: "VERB", translation: "อ่าน" },
  { word: "Write", category: "VERB", translation: "เขียน" },
  { word: "Speak", category: "VERB", translation: "พูด" },
  { word: "Listen", category: "VERB", translation: "ฟัง" },
  { word: "Play", category: "VERB", translation: "เล่น" },
  { word: "Swim", category: "VERB", translation: "ว่ายน้ำ" },
  { word: "Fly", category: "VERB", translation: "บิน" },
  { word: "Sing", category: "VERB", translation: "ร้องเพลง" },
  { word: "Dance", category: "VERB", translation: "เต้น" },
  { word: "Cook", category: "VERB", translation: "ทำอาหาร" },

  // Adjectives
  { word: "Happy", category: "ADJECTIVE", translation: "มีความสุข" },
  { word: "Sad", category: "ADJECTIVE", translation: "เศร้า" },
  { word: "Big", category: "ADJECTIVE", translation: "ใหญ่" },
  { word: "Small", category: "ADJECTIVE", translation: "เล็ก" },
  { word: "Fast", category: "ADJECTIVE", translation: "เร็ว" },
  { word: "Slow", category: "ADJECTIVE", translation: "ช้า" },
  { word: "Hot", category: "ADJECTIVE", translation: "ร้อน" },
  { word: "Cold", category: "ADJECTIVE", translation: "หนาว" },
  { word: "Beautiful", category: "ADJECTIVE", translation: "สวย" },
  { word: "Good", category: "ADJECTIVE", translation: "ดี" },
  { word: "Bad", category: "ADJECTIVE", translation: "แย่" },
  { word: "Red", category: "ADJECTIVE", translation: "สีแดง" },
  { word: "Blue", category: "ADJECTIVE", translation: "สีน้ำเงิน" },
  { word: "Tall", category: "ADJECTIVE", translation: "สูง" },
  { word: "Short", category: "ADJECTIVE", translation: "เตี้ย/สั้น" },
]
