import express from 'express'
import { bookAppoinment, getAppointments } from '../controllers/studentControllers'
import { isStudent } from '../middleware/roleMiddleware'
import { authMiddleware } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/appointment',authMiddleware, isStudent, bookAppoinment)
router.get('/appointments',authMiddleware, isStudent, getAppointments)

export default router;