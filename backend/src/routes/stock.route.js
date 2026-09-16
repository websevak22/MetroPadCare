import { Router } from 'express'
import * as controller from '../controllers/stock.controller.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/config', controller.getConfig)
router.put('/config', authorize('ADMIN'), controller.updateConfig)
router.get('/summary', controller.getStockSummary)
router.get('/stations', controller.getStationWiseStock)
router.get('/monthly', controller.getMonthlyStockReport)
router.post('/monthly/status', authorize('ADMIN', 'OPERATIONS'), controller.setMonthlyRefillStatus)
router.put('/monthly/refill/:machineId', authorize('ADMIN', 'OPERATIONS'), controller.saveMonthlyRefill)
router.get('/remaining', controller.getRemainingCentralStock)

export default router
