import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
    professor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
})


export const availability = mongoose.model("Availability", availabilitySchema);