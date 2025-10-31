import type { PracticeExerciseSets, ExerciseSet, PracticeExercise } from "../../practice-types"

// Sample listening exercises
const listeningExercises: PracticeExercise[] = [
  {
    id: "listen-1",
    title: "Basic Listening Comprehension",
    instructions: "Listen to the audio and select the correct option",
    questionFormat: "multiple-choice",
    skillType: "listening",
    difficultyLevel: "beginner",
    content: {
      audio: "/sounds/hello.mp3",
      options: ["Hello", "Goodbye", "Thank you", "Please"],
      correctAnswer: "Hello",
    },
    feedback: {
      correct: "Great job! You correctly identified the greeting.",
      incorrect: 'The audio says "Hello". Listen carefully to the pronunciation.',
    },
  },
  {
    id: "listen-2",
    title: "Dictation Practice",
    instructions: "Listen to the audio and type what you hear",
    questionFormat: "dictation",
    skillType: "listening",
    difficultyLevel: "beginner",
    content: {
      audio: "/sounds/how-are-you.mp3",
      correctAnswer: "How are you?",
      allowedErrors: 1,
    },
    feedback: {
      correct: "Perfect! You heard the phrase correctly.",
      incorrect: 'The audio says "How are you?". Try listening again.',
    },
  },
]

// Sample speaking exercises
const speakingExercises: PracticeExercise[] = [
  {
    id: "speak-1",
    title: "Basic Pronunciation",
    instructions: "Listen to the word and repeat it",
    questionFormat: "speaking",
    skillType: "speaking",
    difficultyLevel: "beginner",
    content: {
      word: "Hello",
      audioSample: "/sounds/hello.mp3",
    },
    feedback: {
      correct: "Great pronunciation!",
      incorrect: 'Try again, focusing on the "h" sound at the beginning.',
    },
  },
  {
    id: "speak-2",
    title: "Sentence Pronunciation",
    instructions: "Listen to the sentence and repeat it",
    questionFormat: "speaking",
    skillType: "speaking",
    difficultyLevel: "beginner",
    content: {
      sentence: "How are you today?",
      audioSample: "/sounds/how-are-you-today.mp3",
      focusSound: "r",
    },
    feedback: {
      correct: "Excellent sentence pronunciation!",
      incorrect: "Focus on the rhythm of the sentence. Try again.",
    },
  },
]

// Sample reading exercises
const readingExercises: PracticeExercise[] = [
  {
    id: "read-1",
    title: "Reading Comprehension",
    instructions: "Read the passage and answer the question",
    questionFormat: "multiple-choice",
    skillType: "reading",
    difficultyLevel: "beginner",
    content: {
      passage: "John goes to the store every Monday. He buys bread and milk.",
      question: "When does John go to the store?",
      options: ["Every Sunday", "Every Monday", "Every Tuesday", "Every Wednesday"],
      correctAnswer: "Every Monday",
    },
    feedback: {
      correct: "Correct! The passage states that John goes to the store every Monday.",
      incorrect: "The passage states that John goes to the store every Monday.",
    },
  },
  {
    id: "read-2",
    title: "Vocabulary in Context",
    instructions: "Choose the word that best completes the sentence",
    questionFormat: "multiple-choice",
    skillType: "reading",
    difficultyLevel: "beginner",
    content: {
      sentence: "She was **___** after running the marathon.",
      options: ["tired", "happy", "hungry", "angry"],
      correctAnswer: "tired",
    },
    feedback: {
      correct: 'Correct! "Tired" makes the most sense in this context.',
      incorrect: 'After running a marathon, people are typically "tired".',
    },
  },
]

// Sample writing exercises
const writingExercises: PracticeExercise[] = [
  {
    id: "write-1",
    title: "Fill in the Blank",
    instructions: "Complete the sentence with the correct word",
    questionFormat: "fill-blank",
    skillType: "writing",
    difficultyLevel: "beginner",
    content: {
      sentence: "I ___ to the store yesterday.",
      correctAnswer: "went",
      hint: 'Past tense of "go"',
    },
    feedback: {
      correct: 'Correct! "Went" is the past tense of "go".',
      incorrect: 'The past tense of "go" is "went".',
    },
  },
  {
    id: "write-2",
    title: "Short Response",
    instructions: "Write a short paragraph about your favorite food",
    questionFormat: "free-response",
    skillType: "writing",
    difficultyLevel: "beginner",
    content: {
      prompt: "What is your favorite food and why do you like it?",
      minWords: 20,
      suggestedVocabulary: ["delicious", "flavor", "enjoy", "favorite", "taste"],
    },
    feedback: {
      correct: "Great job! You've written a good description of your favorite food.",
      incorrect: "Try to write at least 20 words about your favorite food.",
    },
  },
]

// Sample grammar exercises
const grammarExercises: PracticeExercise[] = [
  {
    id: "grammar-1",
    title: "Present Simple Tense",
    instructions: "Choose the correct form of the verb",
    questionFormat: "multiple-choice",
    skillType: "grammar",
    difficultyLevel: "beginner",
    content: {
      sentence: "She ___ to work every day.",
      options: ["go", "goes", "going", "went"],
      correctAnswer: "goes",
    },
    feedback: {
      correct: 'Correct! With "she" we use "goes" in the present simple.',
      incorrect: 'With "she" we use "goes" in the present simple.',
    },
  },
  {
    id: "grammar-2",
    title: "Past Tense Practice",
    instructions: "Fill in the blank with the past tense form",
    questionFormat: "fill-blank",
    skillType: "grammar",
    difficultyLevel: "beginner",
    content: {
      sentence: "Yesterday, I ___ to the cinema.",
      correctAnswer: "went",
      acceptMultiple: true,
      options: ["went", "walked"],
      hint: 'Past tense of "go"',
    },
    feedback: {
      correct: 'Correct! "Went" is the past tense of "go".',
      incorrect: 'The past tense of "go" is "went".',
    },
  },
]

// Sample vocabulary exercises
const vocabularyExercises: PracticeExercise[] = [
  {
    id: "vocab-1",
    title: "Basic Vocabulary",
    instructions: "Match the word with the correct image",
    questionFormat: "multiple-choice",
    skillType: "vocabulary",
    difficultyLevel: "beginner",
    content: {
      question: "Which image shows an apple?",
      options: [
        "/images/vocabulary/apple.png",
        "/images/vocabulary/bread.png",
        "/images/vocabulary/milk.png",
        "/images/vocabulary/water.png",
      ],
      correctAnswer: "/images/vocabulary/apple.png",
      isImageOption: true,
    },
    feedback: {
      correct: "Correct! That is an apple.",
      incorrect: "The apple is the red, round fruit.",
    },
  },
  {
    id: "vocab-2",
    title: "Word Definitions",
    instructions: "Choose the correct definition",
    questionFormat: "multiple-choice",
    skillType: "vocabulary",
    difficultyLevel: "beginner",
    content: {
      question: 'What does "happy" mean?',
      options: [
        "Feeling pleasure or contentment",
        "Feeling sad or upset",
        "Feeling tired or exhausted",
        "Feeling angry or annoyed",
      ],
      correctAnswer: "Feeling pleasure or contentment",
    },
    feedback: {
      correct: 'Correct! "Happy" means feeling pleasure or contentment.',
      incorrect: '"Happy" means feeling pleasure or contentment.',
    },
  },
]

// Create exercise sets
const listeningExerciseSets: ExerciseSet[] = [
  {
    id: "basic-listening",
    title: "Basic Listening Comprehension",
    description: "Practice your listening skills with simple exercises",
    skillType: "listening",
    difficultyLevel: "beginner",
    exercises: listeningExercises,
    estimatedTimeMinutes: 10,
    xpReward: 20,
  },
]

const speakingExerciseSets: ExerciseSet[] = [
  {
    id: "basic-speaking",
    title: "Basic Speaking Practice",
    description: "Practice your pronunciation with simple exercises",
    skillType: "speaking",
    difficultyLevel: "beginner",
    exercises: speakingExercises,
    estimatedTimeMinutes: 10,
    xpReward: 20,
  },
]

const readingExerciseSets: ExerciseSet[] = [
  {
    id: "basic-reading",
    title: "Basic Reading Comprehension",
    description: "Practice your reading skills with simple exercises",
    skillType: "reading",
    difficultyLevel: "beginner",
    exercises: readingExercises,
    estimatedTimeMinutes: 10,
    xpReward: 20,
  },
]

const writingExerciseSets: ExerciseSet[] = [
  {
    id: "basic-writing",
    title: "Basic Writing Practice",
    description: "Practice your writing skills with simple exercises",
    skillType: "writing",
    difficultyLevel: "beginner",
    exercises: writingExercises,
    estimatedTimeMinutes: 15,
    xpReward: 25,
  },
]

const grammarExerciseSets: ExerciseSet[] = [
  {
    id: "basic-grammar",
    title: "Basic Grammar Practice",
    description: "Practice basic grammar rules with simple exercises",
    skillType: "grammar",
    difficultyLevel: "beginner",
    exercises: grammarExercises,
    estimatedTimeMinutes: 10,
    xpReward: 20,
  },
]

const vocabularyExerciseSets: ExerciseSet[] = [
  {
    id: "basic-vocabulary",
    title: "Basic Vocabulary Practice",
    description: "Learn and practice basic vocabulary with simple exercises",
    skillType: "vocabulary",
    difficultyLevel: "beginner",
    exercises: vocabularyExercises,
    estimatedTimeMinutes: 10,
    xpReward: 20,
  },
]

// Combine all exercise sets
export const allExerciseSets: PracticeExerciseSets = {
  listening: listeningExerciseSets,
  speaking: speakingExerciseSets,
  reading: readingExerciseSets,
  writing: writingExerciseSets,
  grammar: grammarExerciseSets,
  vocabulary: vocabularyExerciseSets,
}
