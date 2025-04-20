import express from 'express'
import { bookAppointment, getAppointments } from '../controllers/studentControllers'
import { isStudent } from '../middleware/roleMiddleware'
import { authMiddleware } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/appointment',authMiddleware, isStudent, bookAppointment)
router.get('/appointments',authMiddleware, isStudent, getAppointments)

export default router;