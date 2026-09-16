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

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MetroPad Care backend is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/metro-lines', metroLineRoutes)
app.use('/api/stations', stationRoutes)
app.use('/api/machines', machineRoutes)
app.use('/api/refills', refillRoutes)
app.use('/api/stock-issues', stockIssueRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/monthly-data', monthlyDataRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/cash-collections', cashCollectionRoutes)
app.use('/api/stock', stockRoutes)
app.use('/api/import', importRoutes)
app.use('/api/users', userRoutes)
app.use('/api/audit-logs', auditRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

const startServer = async () => {
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

startServer()

export default app
