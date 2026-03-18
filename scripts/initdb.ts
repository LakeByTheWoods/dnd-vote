import Database from 'better-sqlite3';
import path from 'path';

// Use `any` for the Database type to satisfy TypeScript
const dbPath = path.join(process.cwd(), 'data.sqlite');
const db: any = new Database(dbPath);

// Example schema: polls, votes, users
db.exec(`
  CREATE TABLE IF NOT EXISTS polls (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY,
    pollId TEXT NOT NULL,
    userId TEXT NOT NULL,
    priority TEXT NOT NULL,
    FOREIGN KEY (pollId) REFERENCES polls(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );
`);

console.log('Database initialized successfully.');