import { Request, Response } from "express";
import { prisma } from "../app";

export const bookAppointment = async (req: Request, res: Response) => {
    try {
        const { professorId, date, time } = req.body
        const studentId = req.user?.id
        if (!studentId || !professorId || !date || !time) {
            res.status(400).json({
                status: "Failed",
                message: "Missing required Fields"
            })
            return
        }

        const isBusy = await prisma.availability.findFirst({
            where: {
                professorId,
                date,
                time,
                isBooked: true
            }
        })

        if (isBusy) {
            res.status(400).json({
                status: "Failed",
                message: "The professor is already booked"
            })
            return
        }


        let newAppointment;
        await prisma.$transaction(async (tx: any) => {
            const updatedAvailability = await tx.availability.update({
                where: {
                    professorId_date_time: {
                        professorId,
                        date,
                        time,
                    }
                },
                data: {
                    isBooked: true
                }
            })

            if (!updatedAvailability) {
                throw new Error("No availability Found")
            }

            const Appointment = await tx.appointment.create({
                data: {
                    studentId,
                    professorId,
                    availabilityId: updatedAvailability?.id,
                }

            })

            newAppointment = Appointment
        })
        res.status(201).json({
            status: "Success",
            message: "Appointment Booked Successfully",
            appointment: newAppointment
        })

    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({
            status: "Failed",
            message: "Server error while booking appointment"
        });
        return
    }
}


export const getAppointments = async (req: Request, res: Response) => {
    try {
        const studentId = req.user?.id

        if (!studentId) {
            res.status(400).json({
                status: "Failed",
                message: "No student ID"
            })
            return
        }
        const appointments = await prisma.appointment.findMany({
            where: {
                studentId
            }
        })

        if (!appointments || appointments.length == 0) {
            res.status(200).json({
                status: "Success",
                message: "No Appointments found",
                appointments: []
            })
            return
        }
        res.status(200).json({
            status: "Success",
            message: "Appointments Fetched Successfully",
            appointments
        })
    } catch (error) {
        console.error("Error Fetching Appointments", error)
        res.status(500).json({
            status: "Failed",
            message: "Server error while fetching Apointments"
        });
        return
    }
}