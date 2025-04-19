import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    availability: { type: mongoose.Schema.Types.ObjectId, ref: "Availability", required: true },
    status: { type: String, enum: ["CONFIRMED", "CANCELLED"], default: "CONFIRMED" },
    createdAt: { type: Date, default: Date.now },
})

export const appointment = mongoose.model("Appointment", appointmentSchema);