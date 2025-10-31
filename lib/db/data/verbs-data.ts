export interface VerbData {
  baseForm: string
  pastSimple: string
  pastParticiple: string
  translation: string
  category: "regular" | "irregular"
  difficulty: number
  exampleSentence: string
}

// Irregular Verbs - Difficulty 1 (Easy)
export const irregularVerbsEasy: VerbData[] = [
  { baseForm: "be", pastSimple: "was/were", pastParticiple: "been", translation: "เป็น, อยู่, คือ", category: "irregular", difficulty: 1, exampleSentence: "I am a student." },
  { baseForm: "have", pastSimple: "had", pastParticiple: "had", translation: "มี", category: "irregular", difficulty: 1, exampleSentence: "I have a book." },
  { baseForm: "do", pastSimple: "did", pastParticiple: "done", translation: "ทำ", category: "irregular", difficulty: 1, exampleSentence: "I do my homework every day." },
  { baseForm: "go", pastSimple: "went", pastParticiple: "gone", translation: "ไป", category: "irregular", difficulty: 1, exampleSentence: "I go to school." },
  { baseForm: "get", pastSimple: "got", pastParticiple: "got/gotten", translation: "ได้รับ, กลายเป็น", category: "irregular", difficulty: 1, exampleSentence: "I get up at 7 AM." },
  { baseForm: "make", pastSimple: "made", pastParticiple: "made", translation: "ทำ, สร้าง", category: "irregular", difficulty: 1, exampleSentence: "I make breakfast." },
  { baseForm: "see", pastSimple: "saw", pastParticiple: "seen", translation: "เห็น, ดู", category: "irregular", difficulty: 1, exampleSentence: "I see a bird." },
  { baseForm: "come", pastSimple: "came", pastParticiple: "come", translation: "มา", category: "irregular", difficulty: 1, exampleSentence: "Come here, please." },
  { baseForm: "take", pastSimple: "took", pastParticiple: "taken", translation: "เอา, นำ", category: "irregular", difficulty: 1, exampleSentence: "Take this pen." },
  { baseForm: "know", pastSimple: "knew", pastParticiple: "known", translation: "รู้", category: "irregular", difficulty: 1, exampleSentence: "I know the answer." },
  { baseForm: "give", pastSimple: "gave", pastParticiple: "given", translation: "ให้", category: "irregular", difficulty: 1, exampleSentence: "Give me a chance." },
  { baseForm: "find", pastSimple: "found", pastParticiple: "found", translation: "หา, พบ", category: "irregular", difficulty: 1, exampleSentence: "I found my keys." },
  { baseForm: "think", pastSimple: "thought", pastParticiple: "thought", translation: "คิด", category: "irregular", difficulty: 1, exampleSentence: "I think so." },
  { baseForm: "say", pastSimple: "said", pastParticiple: "said", translation: "พูด", category: "irregular", difficulty: 1, exampleSentence: "She said hello." },
  { baseForm: "tell", pastSimple: "told", pastParticiple: "told", translation: "บอก", category: "irregular", difficulty: 1, exampleSentence: "Tell me the truth." },
  { baseForm: "buy", pastSimple: "bought", pastParticiple: "bought", translation: "ซื้อ", category: "irregular", difficulty: 1, exampleSentence: "I bought a new phone." },
  { baseForm: "eat", pastSimple: "ate", pastParticiple: "eaten", translation: "กิน", category: "irregular", difficulty: 1, exampleSentence: "I eat breakfast at 8." },
  { baseForm: "drink", pastSimple: "drank", pastParticiple: "drunk", translation: "ดื่ม", category: "irregular", difficulty: 1, exampleSentence: "I drink water." },
  { baseForm: "sleep", pastSimple: "slept", pastParticiple: "slept", translation: "นอน", category: "irregular", difficulty: 1, exampleSentence: "I sleep 8 hours." },
  { baseForm: "sit", pastSimple: "sat", pastParticiple: "sat", translation: "นั่ง", category: "irregular", difficulty: 1, exampleSentence: "Sit down, please." },
  { baseForm: "cut", pastSimple: "cut", pastParticiple: "cut", translation: "ตัด", category: "irregular", difficulty: 1, exampleSentence: "I cut the paper." },
  { baseForm: "put", pastSimple: "put", pastParticiple: "put", translation: "วาง", category: "irregular", difficulty: 1, exampleSentence: "Put it on the table." },
  { baseForm: "let", pastSimple: "let", pastParticiple: "let", translation: "ให้, อนุญาต", category: "irregular", difficulty: 1, exampleSentence: "Let me help you." },
  { baseForm: "set", pastSimple: "set", pastParticiple: "set", translation: "ตั้ง, วาง", category: "irregular", difficulty: 1, exampleSentence: "Set the alarm." },
  { baseForm: "hit", pastSimple: "hit", pastParticiple: "hit", translation: "ตี, ชน", category: "irregular", difficulty: 1, exampleSentence: "He hit the ball." },
]

// Irregular Verbs - Difficulty 2 (Medium)
export const irregularVerbsMedium: VerbData[] = [
  { baseForm: "write", pastSimple: "wrote", pastParticiple: "written", translation: "เขียน", category: "irregular", difficulty: 2, exampleSentence: "I write a letter." },
  { baseForm: "read", pastSimple: "read", pastParticiple: "read", translation: "อ่าน", category: "irregular", difficulty: 2, exampleSentence: "I read books every day." },
  { baseForm: "speak", pastSimple: "spoke", pastParticiple: "spoken", translation: "พูด", category: "irregular", difficulty: 2, exampleSentence: "I speak English." },
  { baseForm: "run", pastSimple: "ran", pastParticiple: "run", translation: "วิ่ง", category: "irregular", difficulty: 2, exampleSentence: "I run every morning." },
  { baseForm: "swim", pastSimple: "swam", pastParticiple: "swum", translation: "ว่ายน้ำ", category: "irregular", difficulty: 2, exampleSentence: "I swim in the pool." },
  { baseForm: "sing", pastSimple: "sang", pastParticiple: "sung", translation: "ร้องเพลง", category: "irregular", difficulty: 2, exampleSentence: "She sings beautifully." },
  { baseForm: "drive", pastSimple: "drove", pastParticiple: "driven", translation: "ขับ", category: "irregular", difficulty: 2, exampleSentence: "I drive to work." },
  { baseForm: "fly", pastSimple: "flew", pastParticiple: "flown", translation: "บิน", category: "irregular", difficulty: 2, exampleSentence: "Birds fly in the sky." },
  { baseForm: "wear", pastSimple: "wore", pastParticiple: "worn", translation: "สวมใส่", category: "irregular", difficulty: 2, exampleSentence: "I wear a uniform." },
  { baseForm: "teach", pastSimple: "taught", pastParticiple: "taught", translation: "สอน", category: "irregular", difficulty: 2, exampleSentence: "She teaches English." },
  { baseForm: "stand", pastSimple: "stood", pastParticiple: "stood", translation: "ยืน", category: "irregular", difficulty: 2, exampleSentence: "Stand up, please." },
  { baseForm: "pay", pastSimple: "paid", pastParticiple: "paid", translation: "จ่าย", category: "irregular", difficulty: 2, exampleSentence: "I paid the bill." },
  { baseForm: "mean", pastSimple: "meant", pastParticiple: "meant", translation: "หมายถึง", category: "irregular", difficulty: 2, exampleSentence: "What does it mean?" },
  { baseForm: "keep", pastSimple: "kept", pastParticiple: "kept", translation: "เก็บ, รักษา", category: "irregular", difficulty: 2, exampleSentence: "Keep it safe." },
  { baseForm: "hold", pastSimple: "held", pastParticiple: "held", translation: "ถือ, จับ", category: "irregular", difficulty: 2, exampleSentence: "Hold my hand." },
  { baseForm: "sell", pastSimple: "sold", pastParticiple: "sold", translation: "ขาย", category: "irregular", difficulty: 2, exampleSentence: "I sold my car." },
  { baseForm: "bring", pastSimple: "brought", pastParticiple: "brought", translation: "นำมา", category: "irregular", difficulty: 2, exampleSentence: "Bring your book." },
  { baseForm: "fight", pastSimple: "fought", pastParticiple: "fought", translation: "ต่อสู้", category: "irregular", difficulty: 2, exampleSentence: "Fight for freedom." },
  { baseForm: "catch", pastSimple: "caught", pastParticiple: "caught", translation: "จับ", category: "irregular", difficulty: 2, exampleSentence: "Catch the ball." },
  { baseForm: "ride", pastSimple: "rode", pastParticiple: "ridden", translation: "ขี่", category: "irregular", difficulty: 2, exampleSentence: "Ride a bicycle." },
]

// Irregular Verbs - Difficulty 3 (Hard)
export const irregularVerbsHard: VerbData[] = [
  { baseForm: "understand", pastSimple: "understood", pastParticiple: "understood", translation: "เข้าใจ", category: "irregular", difficulty: 3, exampleSentence: "I understand the lesson." },
  { baseForm: "forget", pastSimple: "forgot", pastParticiple: "forgotten", translation: "ลืม", category: "irregular", difficulty: 3, exampleSentence: "Don't forget your homework." },
  { baseForm: "begin", pastSimple: "began", pastParticiple: "begun", translation: "เริ่ม", category: "irregular", difficulty: 3, exampleSentence: "Let's begin the class." },
  { baseForm: "build", pastSimple: "built", pastParticiple: "built", translation: "สร้าง", category: "irregular", difficulty: 3, exampleSentence: "They built a house." },
  { baseForm: "catch", pastSimple: "caught", pastParticiple: "caught", translation: "จับ", category: "irregular", difficulty: 3, exampleSentence: "I caught the ball." },
  { baseForm: "draw", pastSimple: "drew", pastParticiple: "drawn", translation: "วาด", category: "irregular", difficulty: 3, exampleSentence: "I draw pictures." },
  { baseForm: "fall", pastSimple: "fell", pastParticiple: "fallen", translation: "ตก, ล้ม", category: "irregular", difficulty: 3, exampleSentence: "Be careful not to fall." },
  { baseForm: "grow", pastSimple: "grew", pastParticiple: "grown", translation: "เติบโต", category: "irregular", difficulty: 3, exampleSentence: "Plants grow quickly." },
  { baseForm: "throw", pastSimple: "threw", pastParticiple: "thrown", translation: "โยน", category: "irregular", difficulty: 3, exampleSentence: "Throw the ball to me." },
  { baseForm: "become", pastSimple: "became", pastParticiple: "become", translation: "กลายเป็น", category: "irregular", difficulty: 3, exampleSentence: "I want to become a teacher." },
]

// Regular Verbs - Difficulty 1 (Easy)
export const regularVerbsEasy: VerbData[] = [
  { baseForm: "walk", pastSimple: "walked", pastParticiple: "walked", translation: "เดิน", category: "regular", difficulty: 1, exampleSentence: "I walk to school." },
  { baseForm: "talk", pastSimple: "talked", pastParticiple: "talked", translation: "พูดคุย", category: "regular", difficulty: 1, exampleSentence: "We talk every day." },
  { baseForm: "work", pastSimple: "worked", pastParticiple: "worked", translation: "ทำงาน", category: "regular", difficulty: 1, exampleSentence: "I work at a bank." },
  { baseForm: "play", pastSimple: "played", pastParticiple: "played", translation: "เล่น", category: "regular", difficulty: 1, exampleSentence: "I play football." },
  { baseForm: "watch", pastSimple: "watched", pastParticiple: "watched", translation: "ดู", category: "regular", difficulty: 1, exampleSentence: "I watch TV." },
  { baseForm: "listen", pastSimple: "listened", pastParticiple: "listened", translation: "ฟัง", category: "regular", difficulty: 1, exampleSentence: "I listen to music." },
  { baseForm: "help", pastSimple: "helped", pastParticiple: "helped", translation: "ช่วยเหลือ", category: "regular", difficulty: 1, exampleSentence: "Can you help me?" },
  { baseForm: "cook", pastSimple: "cooked", pastParticiple: "cooked", translation: "ทำอาหาร", category: "regular", difficulty: 1, exampleSentence: "I cook dinner." },
  { baseForm: "clean", pastSimple: "cleaned", pastParticiple: "cleaned", translation: "ทำความสะอาด", category: "regular", difficulty: 1, exampleSentence: "I clean my room." },
  { baseForm: "open", pastSimple: "opened", pastParticiple: "opened", translation: "เปิด", category: "regular", difficulty: 1, exampleSentence: "Open the door." },
  { baseForm: "look", pastSimple: "looked", pastParticiple: "looked", translation: "มอง", category: "regular", difficulty: 1, exampleSentence: "Look at me." },
  { baseForm: "call", pastSimple: "called", pastParticiple: "called", translation: "เรียก, โทร", category: "regular", difficulty: 1, exampleSentence: "Call me later." },
  { baseForm: "ask", pastSimple: "asked", pastParticiple: "asked", translation: "ถาม", category: "regular", difficulty: 1, exampleSentence: "Ask a question." },
  { baseForm: "answer", pastSimple: "answered", pastParticiple: "answered", translation: "ตอบ", category: "regular", difficulty: 1, exampleSentence: "Answer the phone." },
  { baseForm: "start", pastSimple: "started", pastParticiple: "started", translation: "เริ่ม", category: "regular", difficulty: 1, exampleSentence: "Start now." },
]

// Regular Verbs - Difficulty 2 (Medium)
export const regularVerbsMedium: VerbData[] = [
  { baseForm: "study", pastSimple: "studied", pastParticiple: "studied", translation: "ศึกษา", category: "regular", difficulty: 2, exampleSentence: "I study English." },
  { baseForm: "try", pastSimple: "tried", pastParticiple: "tried", translation: "พยายาม", category: "regular", difficulty: 2, exampleSentence: "Try your best." },
  { baseForm: "visit", pastSimple: "visited", pastParticiple: "visited", translation: "เยี่ยมชม", category: "regular", difficulty: 2, exampleSentence: "I visited Bangkok." },
  { baseForm: "travel", pastSimple: "travelled", pastParticiple: "travelled", translation: "เดินทาง", category: "regular", difficulty: 2, exampleSentence: "I love to travel." },
  { baseForm: "dance", pastSimple: "danced", pastParticiple: "danced", translation: "เต้นรำ", category: "regular", difficulty: 2, exampleSentence: "She dances well." },
  { baseForm: "live", pastSimple: "lived", pastParticiple: "lived", translation: "อาศัย", category: "regular", difficulty: 2, exampleSentence: "I live in Thailand." },
  { baseForm: "love", pastSimple: "loved", pastParticiple: "loved", translation: "รัก", category: "regular", difficulty: 2, exampleSentence: "I love chocolate." },
  { baseForm: "like", pastSimple: "liked", pastParticiple: "liked", translation: "ชอบ", category: "regular", difficulty: 2, exampleSentence: "I like pizza." },
  { baseForm: "want", pastSimple: "wanted", pastParticiple: "wanted", translation: "ต้องการ", category: "regular", difficulty: 2, exampleSentence: "I want to learn." },
  { baseForm: "need", pastSimple: "needed", pastParticiple: "needed", translation: "ต้องการ, จำเป็น", category: "regular", difficulty: 2, exampleSentence: "I need help." },
  { baseForm: "believe", pastSimple: "believed", pastParticiple: "believed", translation: "เชื่อ", category: "regular", difficulty: 2, exampleSentence: "I believe you." },
  { baseForm: "change", pastSimple: "changed", pastParticiple: "changed", translation: "เปลี่ยน", category: "regular", difficulty: 2, exampleSentence: "Change your clothes." },
  { baseForm: "create", pastSimple: "created", pastParticiple: "created", translation: "สร้างสรรค์", category: "regular", difficulty: 2, exampleSentence: "Create art." },
  { baseForm: "decide", pastSimple: "decided", pastParticiple: "decided", translation: "ตัดสินใจ", category: "regular", difficulty: 2, exampleSentence: "Decide now." },
  { baseForm: "enjoy", pastSimple: "enjoyed", pastParticiple: "enjoyed", translation: "สนุกกับ", category: "regular", difficulty: 2, exampleSentence: "Enjoy your meal." },
]

// Regular Verbs - Difficulty 3 (Hard)
export const regularVerbsHard: VerbData[] = [
  { baseForm: "achieve", pastSimple: "achieved", pastParticiple: "achieved", translation: "บรรลุ", category: "regular", difficulty: 3, exampleSentence: "Achieve your goals." },
  { baseForm: "appreciate", pastSimple: "appreciated", pastParticiple: "appreciated", translation: "ชื่นชม", category: "regular", difficulty: 3, exampleSentence: "I appreciate your help." },
  { baseForm: "communicate", pastSimple: "communicated", pastParticiple: "communicated", translation: "สื่อสาร", category: "regular", difficulty: 3, exampleSentence: "Communicate effectively." },
  { baseForm: "consider", pastSimple: "considered", pastParticiple: "considered", translation: "พิจารณา", category: "regular", difficulty: 3, exampleSentence: "Consider this option." },
  { baseForm: "develop", pastSimple: "developed", pastParticiple: "developed", translation: "พัฒนา", category: "regular", difficulty: 3, exampleSentence: "Develop skills." },
  { baseForm: "establish", pastSimple: "established", pastParticiple: "established", translation: "ก่อตั้ง", category: "regular", difficulty: 3, exampleSentence: "Establish a business." },
  { baseForm: "implement", pastSimple: "implemented", pastParticiple: "implemented", translation: "ปฏิบัติ", category: "regular", difficulty: 3, exampleSentence: "Implement the plan." },
  { baseForm: "investigate", pastSimple: "investigated", pastParticiple: "investigated", translation: "สืบสวน", category: "regular", difficulty: 3, exampleSentence: "Investigate the case." },
  { baseForm: "maintain", pastSimple: "maintained", pastParticiple: "maintained", translation: "บำรุงรักษา", category: "regular", difficulty: 3, exampleSentence: "Maintain equipment." },
  { baseForm: "recognize", pastSimple: "recognized", pastParticiple: "recognized", translation: "จำได้", category: "regular", difficulty: 3, exampleSentence: "I recognize you." },
]

export const allVerbs: VerbData[] = [
  ...irregularVerbsEasy,
  ...irregularVerbsMedium,
  ...irregularVerbsHard,
  ...regularVerbsEasy,
  ...regularVerbsMedium,
  ...regularVerbsHard,
]

