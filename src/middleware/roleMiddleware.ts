import { NextFunction, Request, Response } from "express";

export const isStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "Failed",
                message: "Authentication required"
            });
            return
        }
        const userRole = req.user?.role
        if (userRole !== 'STUDENT') {
            res.status(403).json({
                status: "Failed",
                message: "Access denied: Student role required"
            });
            return

        }


        next()
    } catch (error) {
        console.error("Student Role Verification Failed", error)
        res.status(500).json({
            status: "Failed",
            message: "Server error during authorization"
        });
        return
    }

}


export const isProfessor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "Failed",
                message: "Authentication required"
            });
            return
        }
        const userRole = req.user?.role
        if (userRole !== 'PROFESSOR') {
            res.status(403).json({
                status: "Failed",
                message: "Access denied: Professsor role required"
            });
            return

        }
        next()
    } catch (error) {
        console.error("Professor Role Verification Failed", error)
        res.status(500).json({
            status: "Failed",
            message: "Server error during authorization"
        });
        return
    }

}