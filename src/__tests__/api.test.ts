import request from 'supertest'
import { app } from "../app"

describe('College Appointment System E2E Flow', () => {
    const testProfessor = {
        name: "Professor P1",
        email: "professor1@test.com",
        password: "password123",
        role: "PROFESSOR"
    }

    const testStudent1 = {
        name: "Student A1",
        email: "student1@test.com",
        password: "password123",
        role: "STUDENT"
    }

    const testStudent2 = {
        name: "Student A2",
        email: "student2@test.com",
        password: "password123",
        role: "STUDENT"
    }

    let professorToken: string
    let student1Token: string
    let student2Token: string
    let professorId: string
    let student1Id: string
    let student2Id: string
    let timeSlot1 = {
        date: '2025-05-01',
        time: '10:00-11:00'
    }
    let timeSlot2 = {
        date: '2025-05-01',
        time: '11:00-12:00'
    }

    test('Student A1 registers & authenticates to access the system.', async () => {
        const registerResponse = await request(app).post('/api/auth/register').send(testStudent1)
        expect(registerResponse.status).toBe(200)
        expect(registerResponse.body.status).toBe("Success")
        student1Id = registerResponse.body.user.id

        const loginResponse = await request(app).post('/api/auth/login').send({
            email: testStudent1.email,
            password: testStudent1.password
        })

        expect(loginResponse.status).toBe(200)
        expect(loginResponse.body.status).toBe('Success')
        student1Token = loginResponse.body.token
    })

    test('Professor P1 registers & authenticates to access the system', async () => {
        const registerResponse = await request(app).post('/api/auth/register').send(testProfessor)
        expect(registerResponse.status).toBe(200)
        expect(registerResponse.body.status).toBe('Success')
        professorId = registerResponse.body.user.id

        const loginResponse = await request(app).post('/api/auth/login').send({
            email: testProfessor.email,
            password: testProfessor.password
        })

        expect(loginResponse.status).toBe(200)
        expect(loginResponse.body.status).toBe('Success')
        professorToken = loginResponse.body.token
    })

    test('Professor P1 creates availability T1 and T2', async () => {
        const response1 = await request(app).post('/api/professor/availability').set('Authorization', `Bearer ${professorToken}`).send(timeSlot1)

        expect(response1.status).toBe(201)
        expect(response1.body.status).toBe('Success')

        const response2 = await request(app).post('/api/professor/availability').set('Authorization', `Bearer ${professorToken}`).send(timeSlot2)

        expect(response2.status).toBe(201)
        expect(response2.body.status).toBe('Success')
    })

    test('Student A1 views available time slots for Professor P1', async () => {
        const response = await request(app).get(`/api/professor/availability/${professorId}`).set('Authorization', `Bearer ${student1Token}`)

        expect(response.status).toBe(200)
        expect(response.body.status).toBe('Success')
        expect(response.body.data).toHaveLength(2)
        expect(response.body.data[0].isBooked).toBe(false)
        expect(response.body.data[1].isBooked).toBe(false)

    })

    test('Student A1 books an appointment with Professor P1 for time T1', async () => {
        const response = await request(app).post('/api/student/appointment').set('Authorization', `Bearer ${student1Token}`).send({
            professorId,
            date: timeSlot1.date,
            time: timeSlot1.time
        })

        expect(response.status).toBe(201)
        expect(response.body.status).toBe('Success')
    })

    test('Student A2 registers & authenticates to access the system', async () => {
        const registerResponse = await request(app).post('/api/auth/register').send(testStudent2)
        expect(registerResponse.status).toBe(200)
        expect(registerResponse.body.status).toBe("Success")
        student2Id = registerResponse.body.user.id

        const loginResponse = await request(app).post('/api/auth/login').send({
            email: testStudent2.email,
            password: testStudent2.password
        })

        expect(loginResponse.status).toBe(200)
        expect(loginResponse.body.status).toBe('Success')
        student2Token = loginResponse.body.token
    })

    test('Student A2 books an appointment with Professor P1 for time T2', async () => {
        const response = await request(app).post('/api/student/appointment').set('Authorization', `Bearer ${student2Token}`).send({
            professorId,
            date: timeSlot2.date,
            time: timeSlot2.time
        })

        expect(response.status).toBe(201)
        expect(response.body.status).toBe('Success')
    })

    test('Professor P1 cancels the appointment with Student A1', async () => {
        const response = await request(app).post('/api/professor/cancel-appointment').set('Authorization', `Bearer ${professorToken}`).send({
            studentId: student1Id,
            date: timeSlot1.date,
            time: timeSlot1.time
        })

        expect(response.status).toBe(200)
        expect(response.body.status).toBe('Success')
    })

    test('Student A1 checks their appointments', async () => {
        const response = await request(app).get('/api/student/appointments').set('Authorization', `Bearer ${student1Token}`)

        expect(response.status).toBe(200)

        const activeAppointments = response.body.appointments.filter((appt:any) => appt.status !== 'CANCELLED');
        expect(activeAppointments.length).toBe(0)
    })

})