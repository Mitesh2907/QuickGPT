import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



const app = express()

await connectDB()

//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.get('/', (req,res)=>res.send('Server is Live!'))
app.use('/api/user',userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter )
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// server.js (top)
import dotenv from "dotenv";
dotenv.config();

console.log("cwd:", process.cwd());
console.log("ENV ADMIN_USERNAME:", process.env.ADMIN_USERNAME);
console.log("ENV ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);



const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{ 
    console.log(`Server is running on port ${PORT}`)
})