import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/db.js'

import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Database
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Debugging
console.log("cwd:", process.cwd());
console.log("ENV ADMIN_USERNAME:", process.env.ADMIN_USERNAME);
console.log("ENV ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);

// Routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Server Listen
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
