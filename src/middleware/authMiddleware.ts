import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET

declare global {
    namespace Express {
      interface Request {
        user?: {
          id: string;
          email: string;
          role: string;
        }
      }
    }
  }

interface JWTPayload {
    user: string,
    id: string,
    role: string

}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            status: "Failed",
            message: "Authorization token required"
        })
        return
    }
    const token = authHeader.split(' ')[1];

    if (!JWT_SECRET) {
        res.status(500).json({
            status: "Failed",
            message: "Internal Server Error"
        })
        return
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload

    req.user = {
        id: decoded.id,
        email: decoded.user,
        role: decoded.role
    };

    next()
    } catch (error) {
        console.error("Error Occured in Auth Middleware", error)
        res.status(500).json({
            status:"Failed",
            message:"Token Invalid"
        })
    }
}