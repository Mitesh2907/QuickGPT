import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/db.js'

import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config({ silent: true });

const app = express();

// Global request logging (only for debugging)
app.use((req, res, next) => {
  if (req.url.includes('/api/admin')) {
    console.log(`🌐 ${req.method} ${req.url}`);
  }
  next();
});

app.use(express.json({ limit: "5mb" }));
app.use(cors());


// ⭐ Connect DB
await connectDB();

// Routes
app.get('/', (req, res) => res.send('Server is Live!'));

// Test route to verify Express is working
app.get('/test', (req, res) => {
  console.log('🧪 Test route hit');
  res.json({ success: true, message: 'Express is working!' });
});

// Admin routes first (test for conflicts)
app.use("/api/admin", adminRoutes);

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use("/api/payment", paymentRoutes);

// Server listen for local development only
const PORT = process.env.PORT || 3000;

// console.log('Starting server...');
// console.log('PORT:', PORT);




if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
}

export default app;
