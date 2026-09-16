import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SALT_ROUNDS = 10

const users = [
  { id: 'a0000000-0000-0000-0000-000000000001', name: 'Admin User', email: 'admin@metropadcare.com', password: 'Admin@1234', role: 'ADMIN' },
]

const runMigration = async () => {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  })

  try {
    await client.connect()
    console.log('Connected to database')

    await client.query('BEGIN')
    console.log('Transaction started')

    const schemaPath = path.join(__dirname, 'schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8')
    await client.query(schemaSQL)
    console.log('Schema executed successfully')

    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS)
      await client.query(
        `INSERT INTO users (id, name, email, password_hash, role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           email = EXCLUDED.email,
           password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role`,
        [user.id, user.name, user.email, passwordHash, user.role]
      )
      console.log(`User seeded: ${user.name} (${user.email})`)
    }

    const seedPath = path.join(__dirname, 'seed.sql')
    let seedSQL = fs.readFileSync(seedPath, 'utf-8')

    const userInsertRegex = /INSERT\s+INTO\s+users[\s\S]*?ON\s+CONFLICT\s+\(id\)\s+DO\s+NOTHING;/i
    seedSQL = seedSQL.replace(userInsertRegex, '')

    const statements = seedSQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'))

    for (const stmt of statements) {
      await client.query(stmt)
    }
    console.log('Seed data executed successfully')

    await client.query('COMMIT')
    console.log('Transaction committed. Migration complete!')
  } catch (err) {
    console.error('Migration failed:', err.message)
    await client.query('ROLLBACK')
    console.log('Transaction rolled back')
    process.exit(1)
  } finally {
    await client.end()
    console.log('Database connection closed')
  }
}

runMigration()
