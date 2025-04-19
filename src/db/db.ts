import mongoose from "mongoose";
import 'dotenv/config'
const MONGODB_URI = process.env.MONGODB_URI
let isConnected = false;

export const connectToDB = async () => {
    if (isConnected) {
        console.log('Already connected to DB')
        return
    }

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined")
    }

    try {
        await mongoose.connect(MONGODB_URI)
        isConnected = true
        console.log("Connect to DB successfully")
    } catch (error) {
        isConnected = false
        console.error("Error connecting to DB", error)
        throw error
    }
}


