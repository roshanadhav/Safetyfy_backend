import express from 'express' ;
import cors from 'cors' ;
import {Server} from 'socket.io' ; 
import htpp from 'http';
import authRouter from './routes/authRouter.js';
import connection from './database/db.js';
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRouter.js';
const app = express() ;
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
connection();
const server = htpp.createServer(app) ; 

const io = new Server(server , {
    cors:{
        origin: 'https://safetyfy-app.vercel.app',
        credentials: true,
        methods: ["GET", "POST"],
    }
})
app.use(cors({
    origin: 'https://safetyfy-app.vercel.app/',
    credentials: true,
    methods: ["GET", "POST"],
}));

io.on("connection", (socket) => {
    console.log(`✅ New connection: ${socket.id}`);

    // Join Room when Emergency User Calls for Help
    socket.on("joinRoom", (id) => {
        socket.join(id);
        console.log(`👥 ${socket.id} joined room: ${id}`);
    });

    // Receive Live Location & Broadcast it to the Room
        socket.on("sendLocation", ({ id, latitude, longitude }) => {
        console.log(`📍 Location from ${id}: ${latitude}, ${longitude}`);

        // Broadcast to all users in the room
        io.to(id).emit("updateLocation", { latitude, longitude },()=>{
            console.log('data sent')
        });
    });

    socket.on("audio-stream", ({ roomId, audioChunk }) => {
        console.log(`🎤 Audio received in room ${roomId}`);
        socket.to(roomId).emit("audio-stream", audioChunk);
    });

    // Handle Disconnection
    socket.on("disconnect", () => {
        console.log(`❌ ${socket.id} disconnected`);
    });
});

app.use('/api/auth' , authRouter);
app.use('/api/user' , userRouter)
app.get('/',(req,res)=>{
    res.send('hello')
})
server.listen(5000 , ()=>{
    console.log('server is listning on port 5000')
})

