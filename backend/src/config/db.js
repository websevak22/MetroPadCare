import { db, isDbConfigured, requireDb, normalizeError, notConfiguredError } from './supabase.js'

export const connectDB = async () => {
  if (!isDbConfigured()) {
    console.error('Database connection failed: missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
    throw notConfiguredError()
  }
  try {
    const { error } = await requireDb().from('users').select('id').limit(1)
    if (error) {
      throw normalizeError(error)
    }
    console.log('Database connected successfully (via Supabase REST)')
  } catch (err) {
    console.error('Database connection failed:', err.message)
    throw err
  }
}

export const query = async () => {
  throw new Error('Direct SQL queries are not supported against Supabase REST. Use the model layer instead.')
}

export const getClient = async () => {
  throw new Error('Transactions are not supported against Supabase REST. Use the model layer instead.')
}

export const isConfigured = isDbConfigured

export default db