import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    otp:{
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now, index: { expires: "1m" } },
    isUsed: { type: Boolean, default: false },
})

const otpModel = new model('OTP', otpSchema)

export default otpModel