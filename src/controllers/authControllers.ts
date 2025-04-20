import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { prisma } from "../app";

const JWTsecret = process.env.JWT_SECRET || 'secret'

export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(401).json({
                status: "Failed",
                message: "Missing email or Password"
            })
            return
        }
        const User = await prisma.user.findUnique({ where: { email } })

        if (!User) {
            res.status(400).json({
                status: "Failed",
                message: "No Such User"
            })
            return
        }
        const result = await bcrypt.compare(password, User?.password)

        if (!result) {
            res.status(400).json({
                status: "Failed",
                message: "Wrong Password"
            })
            return
        }

        const token = jwt.sign({
            user: User.email,
            id: User.id,
            role: User.role
        }, JWTsecret)

        res.status(200).json({
            status: "Success",
            message: "Logged In Successfully",
            token
        })
    } catch (error) {
        console.error("Error Logging In:", error);

        res.status(500).json({
            status: "Failed",
            message: "Server error while Logging In"
        });
        return
    }
}

export const Register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body
        if (!name || !email || !password || (role !== 'PROFESSOR' && role !== 'STUDENT')) {
            res.status(401).json({
                status: "Failed",
                message: "Missing Fields"
            })
            return
        }

        const userExists = await prisma.user.findUnique({
            where: { email }
        })

        if (userExists) {
            res.status(400).json({
                status: "Failed",
                message: "User with this email already exists"
            })
            return
        }


        const hashedPassword = await bcrypt.hash(password, 10)
        const User = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        })

        res.status(200).json({
            status: "Success",
            message: "User created successfully",
            user: {
                name: User.name,
                email: User.email,
                role: User.role,
                id: User.id
            }
        })
    } catch (error) {
        console.error("Error Registring User:", error);

        res.status(500).json({
            status: "Failed",
            message: "Server error while Registring"
        });

        return
    }
}