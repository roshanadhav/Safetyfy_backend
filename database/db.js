import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config(); 


const connection = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        .then(e=>console.log("connection successfull"))
    } catch (error) {
        console.log("Error while connecting " , error.message)
    }
}

process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
});

export default connection ;