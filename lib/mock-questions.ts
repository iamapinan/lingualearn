export function getMockQuestionsForLesson(lessonId: number) {
  // Create a unique set of questions based on the lesson ID
  const uniqueId = lessonId * 100 // Ensure each lesson has a unique ID range

  // Define question categories based on lesson ID ranges
  if (lessonId % 10 === 1) {
    // Greetings and introductions
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which phrase is used to greet someone in the morning?",
        options: JSON.stringify(["Good morning", "Good evening", "Good night", "Goodbye"]),
        correctAnswer: "Good morning",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the greetings with the appropriate time",
        options: JSON.stringify([
          { id: 1, text: "Good morning", matchId: 4, side: "left" },
          { id: 2, text: "Good afternoon", matchId: 5, side: "left" },
          { id: 3, text: "Good evening", matchId: 6, side: "left" },
          { id: 4, text: "5-12 AM", matchId: 1, side: "right" },
          { id: 5, text: "12-5 PM", matchId: 2, side: "right" },
          { id: 6, text: "5-9 PM", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "_____ to meet you! My name is John.",
        options: JSON.stringify(["Nice", "Happy", "Glad", "Pleased"]),
        correctAnswer: "Nice",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is a formal way to greet someone?",
        options: JSON.stringify(["Hey!", "Hello, how do you do?", "What's up?", "Hi there!"]),
        correctAnswer: "Hello, how do you do?",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What do you say when leaving a place in the evening?",
        options: JSON.stringify(["Good morning", "Hello", "Good evening", "Good night"]),
        correctAnswer: "Good night",
      },
    ]
  } else if (lessonId % 10 === 2) {
    // Basic vocabulary - food
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which of these is a fruit?",
        options: JSON.stringify(["Carrot", "Potato", "Apple", "Onion"]),
        correctAnswer: "Apple",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the foods with their categories",
        options: JSON.stringify([
          { id: 1, text: "Apple", matchId: 4, side: "left" },
          { id: 2, text: "Chicken", matchId: 5, side: "left" },
          { id: 3, text: "Bread", matchId: 6, side: "left" },
          { id: 4, text: "Fruit", matchId: 1, side: "right" },
          { id: 5, text: "Meat", matchId: 2, side: "right" },
          { id: 6, text: "Grain", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "I would like a glass of _____.",
        options: JSON.stringify(["water", "chair", "book", "pen"]),
        correctAnswer: "water",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which meal is typically eaten in the morning?",
        options: JSON.stringify(["Breakfast", "Lunch", "Dinner", "Supper"]),
        correctAnswer: "Breakfast",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "Which of these is a vegetable?",
        options: JSON.stringify(["Orange", "Banana", "Broccoli", "Milk"]),
        correctAnswer: "Broccoli",
      },
    ]
  } else if (lessonId % 10 === 3) {
    // Numbers and counting
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "What comes after 'nineteen'?",
        options: JSON.stringify(["Eighteen", "Twenty", "Twelve", "Ninety"]),
        correctAnswer: "Twenty",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the numbers with their written forms",
        options: JSON.stringify([
          { id: 1, text: "1", matchId: 4, side: "left" },
          { id: 2, text: "5", matchId: 5, side: "left" },
          { id: 3, text: "10", matchId: 6, side: "left" },
          { id: 4, text: "One", matchId: 1, side: "right" },
          { id: 5, text: "Five", matchId: 2, side: "right" },
          { id: 6, text: "Ten", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "There are _____ days in a week.",
        options: JSON.stringify(["seven", "five", "ten", "thirty"]),
        correctAnswer: "seven",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is the correct spelling of 25?",
        options: JSON.stringify(["Twenty-five", "Twentyfive", "Twoty-five", "Twenty five"]),
        correctAnswer: "Twenty-five",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "How many months are in a year?",
        options: JSON.stringify(["10", "11", "12", "13"]),
        correctAnswer: "12",
      },
    ]
  } else if (lessonId % 10 === 4) {
    // Colors and descriptions
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which color is made by mixing blue and yellow?",
        options: JSON.stringify(["Red", "Purple", "Green", "Orange"]),
        correctAnswer: "Green",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the colors with common objects of that color",
        options: JSON.stringify([
          { id: 1, text: "Red", matchId: 4, side: "left" },
          { id: 2, text: "Blue", matchId: 5, side: "left" },
          { id: 3, text: "Green", matchId: 6, side: "left" },
          { id: 4, text: "Apple", matchId: 1, side: "right" },
          { id: 5, text: "Sky", matchId: 2, side: "right" },
          { id: 6, text: "Grass", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "The sun is _____.",
        options: JSON.stringify(["yellow", "blue", "green", "purple"]),
        correctAnswer: "yellow",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is NOT a primary color?",
        options: JSON.stringify(["Red", "Blue", "Green", "Yellow"]),
        correctAnswer: "Green",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What color is often associated with sadness?",
        options: JSON.stringify(["Red", "Blue", "Yellow", "Green"]),
        correctAnswer: "Blue",
      },
    ]
  } else if (lessonId % 10 === 5) {
    // Family members
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Your father's sister is your:",
        options: JSON.stringify(["Mother", "Aunt", "Cousin", "Sister"]),
        correctAnswer: "Aunt",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match family members with their relationships",
        options: JSON.stringify([
          { id: 1, text: "Father", matchId: 4, side: "left" },
          { id: 2, text: "Mother", matchId: 5, side: "left" },
          { id: 3, text: "Sibling", matchId: 6, side: "left" },
          { id: 4, text: "Dad", matchId: 1, side: "right" },
          { id: 5, text: "Mom", matchId: 2, side: "right" },
          { id: 6, text: "Brother/Sister", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "Your mother's mother is your _____.",
        options: JSON.stringify(["grandmother", "grandfather", "aunt", "cousin"]),
        correctAnswer: "grandmother",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "What do you call your parent's son?",
        options: JSON.stringify(["Brother", "Uncle", "Cousin", "Nephew"]),
        correctAnswer: "Brother",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What is the relationship between your children?",
        options: JSON.stringify(["Parents", "Siblings", "Cousins", "Grandparents"]),
        correctAnswer: "Siblings",
      },
    ]
  } else if (lessonId % 10 === 6) {
    // Common verbs
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which word describes the action of moving on foot?",
        options: JSON.stringify(["Run", "Walk", "Jump", "Sit"]),
        correctAnswer: "Walk",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the verbs with their meanings",
        options: JSON.stringify([
          { id: 1, text: "Eat", matchId: 4, side: "left" },
          { id: 2, text: "Sleep", matchId: 5, side: "left" },
          { id: 3, text: "Read", matchId: 6, side: "left" },
          { id: 4, text: "Consume food", matchId: 1, side: "right" },
          { id: 5, text: "Rest with eyes closed", matchId: 2, side: "right" },
          { id: 6, text: "Look at and comprehend text", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "I _____ to school every day.",
        options: JSON.stringify(["go", "goes", "going", "went"]),
        correctAnswer: "go",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which verb is in the past tense?",
        options: JSON.stringify(["Walk", "Walks", "Walking", "Walked"]),
        correctAnswer: "Walked",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What is the opposite of 'buy'?",
        options: JSON.stringify(["Sell", "Give", "Take", "Borrow"]),
        correctAnswer: "Sell",
      },
    ]
  } else if (lessonId % 10 === 7) {
    // Time and dates
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "How many seconds are in a minute?",
        options: JSON.stringify(["30", "60", "90", "100"]),
        correctAnswer: "60",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the time periods with their durations",
        options: JSON.stringify([
          { id: 1, text: "Minute", matchId: 4, side: "left" },
          { id: 2, text: "Hour", matchId: 5, side: "left" },
          { id: 3, text: "Day", matchId: 6, side: "left" },
          { id: 4, text: "60 seconds", matchId: 1, side: "right" },
          { id: 5, text: "60 minutes", matchId: 2, side: "right" },
          { id: 6, text: "24 hours", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "There are _____ months in a year.",
        options: JSON.stringify(["twelve", "ten", "seven", "thirty"]),
        correctAnswer: "twelve",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is NOT a day of the week?",
        options: JSON.stringify(["Monday", "Friday", "January", "Sunday"]),
        correctAnswer: "January",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What comes after Wednesday?",
        options: JSON.stringify(["Tuesday", "Thursday", "Friday", "Monday"]),
        correctAnswer: "Thursday",
      },
    ]
  } else if (lessonId % 10 === 8) {
    // Places and directions
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Where would you go to borrow books?",
        options: JSON.stringify(["Hospital", "Library", "Restaurant", "Park"]),
        correctAnswer: "Library",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the places with their functions",
        options: JSON.stringify([
          { id: 1, text: "School", matchId: 4, side: "left" },
          { id: 2, text: "Hospital", matchId: 5, side: "left" },
          { id: 3, text: "Restaurant", matchId: 6, side: "left" },
          { id: 4, text: "Learning", matchId: 1, side: "right" },
          { id: 5, text: "Healthcare", matchId: 2, side: "right" },
          { id: 6, text: "Dining", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "Turn _____ at the traffic light to reach the museum.",
        options: JSON.stringify(["right", "left", "around", "back"]),
        correctAnswer: "right",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is the opposite of 'north'?",
        options: JSON.stringify(["East", "West", "South", "Up"]),
        correctAnswer: "South",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "Where would you go to see animals?",
        options: JSON.stringify(["Library", "Zoo", "Bank", "Post Office"]),
        correctAnswer: "Zoo",
      },
    ]
  } else if (lessonId % 10 === 9) {
    // Weather and seasons
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which season comes after winter?",
        options: JSON.stringify(["Summer", "Fall", "Spring", "Autumn"]),
        correctAnswer: "Spring",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the weather conditions with their descriptions",
        options: JSON.stringify([
          { id: 1, text: "Sunny", matchId: 4, side: "left" },
          { id: 2, text: "Rainy", matchId: 5, side: "left" },
          { id: 3, text: "Snowy", matchId: 6, side: "left" },
          { id: 4, text: "Clear sky with bright sun", matchId: 1, side: "right" },
          { id: 5, text: "Water falling from clouds", matchId: 2, side: "right" },
          { id: 6, text: "White flakes falling from sky", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "It's very _____ in summer.",
        options: JSON.stringify(["hot", "cold", "windy", "snowy"]),
        correctAnswer: "hot",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which season is associated with falling leaves?",
        options: JSON.stringify(["Spring", "Summer", "Fall/Autumn", "Winter"]),
        correctAnswer: "Fall/Autumn",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What do you need when it's raining?",
        options: JSON.stringify(["Sunglasses", "Umbrella", "Gloves", "Scarf"]),
        correctAnswer: "Umbrella",
      },
    ]
  } else {
    // Basic grammar and sentence structure
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is a complete sentence?",
        options: JSON.stringify(["Running fast.", "The dog barks.", "Beautiful flower.", "Very quickly."]),
        correctAnswer: "The dog barks.",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the words with their parts of speech",
        options: JSON.stringify([
          { id: 1, text: "Happy", matchId: 4, side: "left" },
          { id: 2, text: "Run", matchId: 5, side: "left" },
          { id: 3, text: "Quickly", matchId: 6, side: "left" },
          { id: 4, text: "Adjective", matchId: 1, side: "right" },
          { id: 5, text: "Verb", matchId: 2, side: "right" },
          { id: 6, text: "Adverb", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "She _____ to the store yesterday.",
        options: JSON.stringify(["go", "goes", "went", "going"]),
        correctAnswer: "went",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which sentence uses the correct pronoun?",
        options: JSON.stringify([
          "Me am happy.",
          "Her is going to school.",
          "They are my friends.",
          "Him likes pizza.",
        ]),
        correctAnswer: "They are my friends.",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "Which word is a noun?",
        options: JSON.stringify(["Run", "Beautiful", "Quickly", "Teacher"]),
        correctAnswer: "Teacher",
      },
    ]
  }
}
