import mongoose from "mongoose";

let isConnected = false; // prevent re-connection in serverless

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "quickgpt",
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  }
};

export default connectDB;
