import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const configured = Boolean(url && serviceKey && url.startsWith('http'))

export const db = configured ? createClient(url, serviceKey) : null

export const isDbConfigured = () => configured

export const normalizeError = (err) => {
  if (!err) return err
  const base = new Error(err.message || 'Database request failed')
  base.code = err.code || undefined
  base.statusCode = err.status || Number(err.code) || undefined
  base.isOperational = true
  return base
}

export const notConfiguredError = () => {
  const err = new Error(
    'Database is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to backend/.env.'
  )
  err.statusCode = 500
  err.isOperational = true
  return err
}

export const requireDb = () => {
  if (!db || !configured) throw notConfiguredError()
  return db
}