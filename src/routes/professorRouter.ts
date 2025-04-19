import express from 'express'
import { cancelAppointment, createAvailability, getAvailability } from '../controllers/professorControllers';
import { isProfessor } from '../middleware/roleMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router()

router.post('/availability',authMiddleware, isProfessor, createAvailability)
router.get('/availability/:id',authMiddleware, getAvailability)
router.post('/cancel-appointment',authMiddleware,isProfessor, cancelAppointment)

export default router;