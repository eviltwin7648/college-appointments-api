import express from 'express'
import cors from 'cors'
import { connectToDB } from './db/db'
import authRouter from './routes/authRouter'
import professorRouter from './routes/professorRouter'
import studentRouter from './routes/studentRouter'

import 'dotenv/config'

export const app = express()
const PORT = process.env.PORT || 3000

// connectToDB()

app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.use('/api/auth', authRouter)
app.use('/api/professor', professorRouter)
app.use('/api/student',studentRouter)


app.listen(PORT, () => {
    console.log('app is running on port ' + PORT)
})
