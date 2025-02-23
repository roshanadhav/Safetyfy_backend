import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyOtp: {
        type: String,
        default: "",
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0,
    },
    isVerified: { // ✅ Fixed Typo
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: "",
    },
    resetOtpExpireAt: { // ✅ Fixed Typo
        type: Number,
        default: 0,
    },
    emergencyPhonenumber: [
        {
            type: String, // ✅ Changed to String (preserves leading zeros)
        },
    ],
    emergencyEmail: [
        {
            type: String,
        },
    ],
    emergencyWhNumber: [
        {
            type: String, // ✅ Changed to String for WhatsApp numbers
        },
    ],
});

// ✅ Corrected model export
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;    
