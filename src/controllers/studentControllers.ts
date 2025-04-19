import { Request, Response } from "express";
import { availability } from "../db/models/availbilityModel";
import { appointment } from "../db/models/appoinmentModel";
import mongoose from "mongoose";

export const bookAppoinment = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();

    try {
        const { professorId, date, time } = req.body
        const studentId = req.user?.id
        if (!studentId || !professorId || !date || !time) {
            res.status(401).json({
                status: "Failed",
                message: "Missing required Fields"
            })
            return
        }

        const isBusy = await availability.findOne({
            professor: professorId,
            date,
            time,
            isBooked: true
        })

        if (isBusy) {
            res.status(400).json({
                status: "Failed",
                message: "The professor is already booked"
            })
            return
        }


        let newAppoinment;
        await session.withTransaction(async () => {
            const updatedAvailability = await availability.findOneAndUpdate({
                professor: professorId,
                date,
                time,
            }, {
                isBooked: true
            }, {
                session, new: true
            })

            if (!updatedAvailability) {
                throw new Error("No availability Found")
            }

            const Appointment = await appointment.create([{
                student: studentId,
                professor: professorId,
                availability: updatedAvailability?._id,

            }], { session })

            newAppoinment = Appointment[0]
        })
        res.status(200).json({
            status: "Success",
            message: "Appointment Booked Successfully",
            newAppoinment
        })

    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({
            status: "Failed",
            message: "Server error while booking appointment"
        });
        return
    } finally {
        session.endSession();
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
        const appointments = await appointment.find({
            student: studentId
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