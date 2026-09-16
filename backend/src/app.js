import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.route.js'
import metroLineRoutes from './routes/metroLine.route.js'
import stationRoutes from './routes/station.route.js'
import machineRoutes from './routes/machine.route.js'
import refillRoutes from './routes/refill.route.js'
import stockIssueRoutes from './routes/stockIssue.route.js'
import maintenanceRoutes from './routes/maintenance.route.js'
import dashboardRoutes from './routes/dashboard.route.js'
import monthlyDataRoutes from './routes/monthlyData.route.js'
import reportRoutes from './routes/report.route.js'
import cashCollectionRoutes from './routes/cashCollection.route.js'
import stockRoutes from './routes/stock.route.js'
import importRoutes from './routes/import.route.js'
import userRoutes from './routes/user.route.js'
import auditRoutes from './routes/audit.route.js'

dotenv.config()

const createApiRouter = () => {
  const api = express.Router()

  api.get('/', (req, res) => {
    res.json({ success: true, message: 'MetroPad Care API. Health check: /api/health' })
  })

  api.get('/health', (req, res) => {
    res.json({ success: true, message: 'MetroPad Care backend is running' })
  })

  api.use('/auth', authRoutes)
  api.use('/metro-lines', metroLineRoutes)
  api.use('/stations', stationRoutes)
  api.use('/machines', machineRoutes)
  api.use('/refills', refillRoutes)
  api.use('/stock-issues', stockIssueRoutes)
  api.use('/maintenance', maintenanceRoutes)
  api.use('/dashboard', dashboardRoutes)
  api.use('/monthly-data', monthlyDataRoutes)
  api.use('/reports', reportRoutes)
  api.use('/cash-collections', cashCollectionRoutes)
  api.use('/stock', stockRoutes)
  api.use('/import', importRoutes)
  api.use('/users', userRoutes)
  api.use('/audit-logs', auditRoutes)

  api.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
  })

  api.use(errorHandler)

  return api
}

const apiRouter = createApiRouter()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))

// Mount the API both at /api (standard) and at root (Vercel serverless functions
// can forward the full request path, so /api/health and /health both work).
app.use('/api', apiRouter)
app.use('/', apiRouter)

app.use(errorHandler)

const startServer = async () => {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`MetroPad Care backend running on http://localhost:${PORT}`)
  })
  try {
    await connectDB()
    console.log('Database connection established')
  } catch (err) {
    console.warn(
      `WARNING: Database not connected — check DATABASE_URL in backend/.env. Error: ${err.message}`
    )
  }
}

// On Vercel the function host runs the app — only self-listen outside Vercel.
if (!process.env.VERCEL) {
  startServer()
}

export default app