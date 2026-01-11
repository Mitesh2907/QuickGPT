import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    credits : {type: Number, default: 20},
    isAdmin: { type: Boolean, default: false }
});

// Hash password
userSchema.pre("save", async function() {
  // Only hash password if it's modified or new
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // Let Mongoose handle the error
  }
});


const User = mongoose.model('User', userSchema);
export default User;
