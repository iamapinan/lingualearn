// ไฟล์นี้ใช้สำหรับจัดการเสียงในแอปพลิเคชัน

// ตรวจสอบว่าเสียงพร้อมใช้งานหรือไม่
const checkAudioAvailability = async (audioPath: string): Promise<boolean> => {
  try {
    const response = await fetch(audioPath, { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.log(`Audio file not available: ${audioPath}`)
    return false
  }
}

// เสียงเมื่อตอบถูก
export function playCorrectSound() {
  try {
    // ใช้เสียงที่สร้างด้วย Web Audio API แทนการโหลดไฟล์
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (err) {
    console.error("Error playing correct sound:", err)
  }
}

// เสียงเมื่อตอบผิด
export function playIncorrectSound() {
  try {
    // ใช้เสียงที่สร้างด้วย Web Audio API แทนการโหลดไฟล์
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3)

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (err) {
    console.error("Error playing incorrect sound:", err)
  }
}

// เสียงเมื่อได้รับคะแนน
export function playPointsSound() {
  try {
    // ใช้เสียงที่สร้างด้วย Web Audio API แทนการโหลดไฟล์
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // สร้างเสียงสั้นๆ สองครั้ง
    const playNote = (time: number, freq: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = freq

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + time)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.1)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start(audioContext.currentTime + time)
      oscillator.stop(audioContext.currentTime + time + 0.1)
    }

    playNote(0, 600)
    playNote(0.15, 800)
  } catch (err) {
    console.error("Error playing points sound:", err)
  }
}

// เสียงเมื่อจบด่าน
export function playLevelCompleteSound() {
  try {
    // ใช้เสียงที่สร้างด้วย Web Audio API แทนการโหลดไฟล์
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // สร้างเสียงเพลงสั้นๆ
    const playNote = (time: number, freq: number, duration: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = freq

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + time)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + duration)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start(audioContext.currentTime + time)
      oscillator.stop(audioContext.currentTime + time + duration)
    }

    playNote(0, 523.25, 0.2) // C
    playNote(0.2, 659.25, 0.2) // E
    playNote(0.4, 783.99, 0.2) // G
    playNote(0.6, 1046.5, 0.4) // C (octave up)
  } catch (err) {
    console.error("Error playing level complete sound:", err)
  }
}

// เสียงสำหรับการฟัง (ใช้ Speech Synthesis API)
export function playAudioForWord(word: string, language: string) {
  try {
    // ตรวจสอบว่า Speech Synthesis API พร้อมใช้งานหรือไม่
    if (!("speechSynthesis" in window)) {
      console.error("Speech Synthesis API is not supported in this browser")
      return
    }

    // สร้าง utterance
    const utterance = new SpeechSynthesisUtterance(word)

    // กำหนดภาษาตามพารามิเตอร์
    switch (language) {
      case "en":
        utterance.lang = "en-US"
        break
      case "es":
        utterance.lang = "es-ES"
        break
      case "fr":
        utterance.lang = "fr-FR"
        break
      case "th":
        utterance.lang = "th-TH"
        break
      default:
        utterance.lang = "en-US"
    }

    // ปรับความเร็วและระดับเสียง
    utterance.rate = 0.9 // ช้าลงเล็กน้อยเพื่อให้ฟังชัดขึ้น
    utterance.volume = 1.0

    // เล่นเสียง
    window.speechSynthesis.speak(utterance)
  } catch (err) {
    console.error("Error using Speech Synthesis:", err)
  }
}
