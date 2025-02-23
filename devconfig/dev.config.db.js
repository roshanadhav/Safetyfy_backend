import mongoose from "mongoose";
import User from "../models/user.js"; // Adjust path to your User model

const updateUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb+srv://roshanadhav02:MTlY5CcWHQ1KzntR@hartly.k7ki0.mongodb.net/?retryWrites=true&w=majority&appName=Hartly", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const userId = "679a32bef7aff3c2bbce0964"; // User's _id

        // New data to update
        const updateData = {
            name: "Roshan Adhav",
            isVerified: false,
            resetOtp: "123456",
            emergencyPhonenumber: ["9822773332", "9579519743"], // Updated numbers
            emergencyEmail: ["m31122004k@gmail.com", "roshanadhav07@gmailcom"],
            emergencyWhNumber: ["9822773332", "9579519743"], // Updated WhatsApp numbers
        };

        // Update user
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true, // Return updated document
            runValidators: true, // Ensure validation rules are applied
        });

        console.log("✅ Updated User:", updatedUser);
    } catch (error) {
        console.error("❌ Error updating user:", error);
    } finally {
        mongoose.connection.close(); // Close connection
    }
};

updateUser();
