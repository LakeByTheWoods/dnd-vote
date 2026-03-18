import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data.sqlite')
export const db = new Database(dbPath)

// Initialize table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS polls (
    id TEXT PRIMARY KEY,
    dates TEXT,        -- JSON array
    votes TEXT         -- JSON array of votes
  )
`).run()