import { Request, Response } from "express";
import { prisma } from "../app";

export const createAvailability = async (req: Request, res: Response) => {
    try {
        const { date, time } = req.body;
        const professorId = req.user?.id
        if (!professorId || !date || !time) {
            res.status(400).json({
                status: "Failed",
                message: "Missing Required Field"
            });
            return
        }

        const availabilityExists = await prisma.availability.findFirst({
            where: {
                professorId,
                date,
                time
            }
        });

        if (availabilityExists) {
            res.status(409).json({
                status: "Failed",
                message: "Availability already exists at the specified Date and Time"
            });
            return
        }

        const newAvailability = await prisma.availability.create({
            data: {
                professorId: professorId,
                date,
                time
            }
        });

        res.status(201).json({
            status: "Success",
            message: "Availability Created.",
            data: newAvailability
        });

    } catch (error) {
        console.error("Error creating availability:", error);

        res.status(500).json({
            status: "Failed",
            message: "Server error while creating availability"
        });
        return
    }
};


export const getAvailability = async (req: Request, res: Response) => {
    try {
        const professorId = req.params.id;

        if (!professorId) {
            res.status(400).json({
                status: "Failed",
                message: "Missing ProfessorID"
            });
            return
        }

        const availabilities = await prisma.availability.findMany({
            where: {
                professorId,
                isBooked: false
            }
        });

        res.status(200).json({
            status: "Success",
            data: availabilities
        });
        return
    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({
            status: "Failed",
            message: "Server error while fetching availability"
        });
        return
    }
};


export const cancelAppointment = async (req: Request, res: Response) => {

    try {

        const { studentId, date, time } = req.body
        const professorId = req.user?.id
        if (!studentId || !professorId || !date || !time) {
            res.status(400).json({
                status: "Failed",
                message: "Missing Fields"
            })
            return
        }

        await prisma.$transaction(async (tx: any) => {
            const updatedAvailability = await tx.availability.update({
                where: {
                    professorId_date_time: {
                        professorId,
                        date,
                        time
                    }
                },
                data: {
                    isBooked: false
                }
            })


            if (!updatedAvailability) {
                throw new Error("Failed to Update Availability")
            }

            const updatedAppointment = await tx.appointment.update({
                where: {
                    professorId,
                    studentId,
                    availabilityId: updatedAvailability.id
                },
                data: {
                    status: "CANCELLED"
                }

            })
            if (!updatedAppointment) {
                throw new Error("Appointment not Found")
            }
        })



        res.status(200).json({
            status: "Success",
            message: "Appointment Cancelled Successfully",
        })
    }
    catch (error) {
        console.error("Error Cancelling appointment:", error);
        res.status(500).json({
            status: "Failed",
            message: "Server error while cancelling appointment"
        });
        return
    }
}