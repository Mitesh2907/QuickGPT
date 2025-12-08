import mongoose from "mongoose";
import User from "./models/User.js";
import "dotenv/config";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

async function createAdmin() {
  const exists = await User.findOne({ isAdmin: true });

  if (exists) {
    console.log("Admin already exists:", exists);
    process.exit(0);
  }

  const admin = await User.create({
    name: "miteshsharma1232",                 
    email: "mit@gmail.com",     
    password: "miteshsharma1232",          
    isAdmin: true
  });

  console.log("Admin created:", admin);
  process.exit(0);
}

createAdmin();
