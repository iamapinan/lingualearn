import { getDb, schema } from "./index"
import { languages } from "./data/languages-data"
import { englishLessons, englishQuestions } from "./data/english-lessons-data"
import { missions, badges } from "./data/missions-data"
import { challenges } from "./data/challenges-data"
import { achievements } from "./data/achievements-data"
import { vocabulary } from "./data/vocabulary-data"

type SchemaKey = keyof typeof schema

const migrateTables = [
  "languages",
  "achievements",
  "badges",
  "userStats",
  "lessons",
  "questions",
  "challenges",
  "missions",
  'vocabulary'
] as const

export async function migrateDatabase() {
  const db = getDb()
  console.log("Initializing database...")

  for (const table of migrateTables) {
    console.log(`${table} is being initialized...`)
    switch (table) {
      case "languages":
        await db.delete(schema.languages)
        await db.insert(schema.languages).values(languages)
        console.log('Inserted ' + languages.length + ' rows')
        break
      case "achievements":
        await db.delete(schema.achievements)
        await db.insert(schema.achievements).values(achievements)
        console.log('Inserted ' + achievements.length + ' rows')
        break
      case "badges":
        await db.delete(schema.badges)
        await db.insert(schema.badges).values(badges)
        console.log('Inserted ' + badges.length + ' rows')
        break
      case "userStats":
        await db.delete(schema.userStats)
        await db.insert(schema.userStats).values({
          id: 1,
          totalXp: 120,
          lessonsCompleted: 8,
          joinedDate: new Date().toISOString().split("T")[0],
          level: 1,
          totalPoints: 120,
        })
        console.log('Inserted 1 row')
        break
      case "lessons":
        await db.delete(schema.lessons)
        await db.insert(schema.lessons).values(englishLessons)
        console.log('Inserted ' + englishLessons.length + ' rows')
        break
      case "questions":
        await db.delete(schema.questions)
        await db.insert(schema.questions).values(englishQuestions)
        console.log('Inserted ' + englishQuestions.length + ' rows')
        break
      case "challenges":
        await db.delete(schema.challenges)
        await db.insert(schema.challenges).values(challenges)
        console.log('Inserted ' + challenges.length + ' rows')
        break
      case "missions":
        await db.delete(schema.missions)
        await db.insert(schema.missions).values(missions)
        console.log('Inserted ' + missions.length + ' rows')
        break
      case "vocabulary":
        await db.delete(schema.vocabulary)
        await db.insert(schema.vocabulary).values(vocabulary)
        console.log('Inserted ' + vocabulary.length + ' rows')
        break
    }
    
  }

  console.log("Database initialized successfully")
}

