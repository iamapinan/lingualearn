
import { getDb, closeConnection } from "../lib/db/connection"
import { verbs } from "../lib/db/schema"
import { allVerbs } from "../lib/db/data/verbs-data"
import { eq } from "drizzle-orm"
import * as fs from 'fs'
import * as path from 'path'

// Try to load .env
try {
  const envPath = path.resolve(__dirname, '../.env')
  if (fs.existsSync(envPath)) {
    const envConfig = require('dotenv').parse(fs.readFileSync(envPath))
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }
  }
} catch (e) {
  console.log('Could not load .env file, relying on process.env')
}

async function seed() {
  console.log('Starting seed...')
  try {
    const db = await getDb()
    
    // Check existing
    const existingVerbs = await db.select().from(verbs).limit(1)
    if (existingVerbs.length > 0) {
      console.log('Verbs already exist. Deleting...')
      await db.delete(verbs)
    }

    console.log(`Inserting ${allVerbs.length} verbs...`)
    
    // Insert in batches to avoid issues
    const batchSize = 100
    let insertedCount = 0
    
    for (let i = 0; i < allVerbs.length; i += batchSize) {
      const batch = allVerbs.slice(i, i + batchSize)
      const values = batch.map(verb => ({
        userId: 1,
        baseForm: verb.baseForm,
        pastSimple: verb.pastSimple,
        pastParticiple: verb.pastParticiple,
        translation: verb.translation,
        category: verb.category,
        languageId: 1,
        languageCode: "en",
        difficulty: verb.difficulty,
        exampleSentence: verb.exampleSentence,
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + 86400000),
        correctCount: 0,
        incorrectCount: 0,
      }))
      
      await db.insert(verbs).values(values)
      insertedCount += batch.length
      console.log(`Inserted ${insertedCount}/${allVerbs.length}`)
    }

    console.log('Seed completed successfully!')
  } catch (error) {
    console.error('Seed failed:', error)
  } finally {
    await closeConnection()
    process.exit(0)
  }
}

seed()
