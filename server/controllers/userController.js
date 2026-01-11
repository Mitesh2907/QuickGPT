import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import Chat from "../models/Chat.js";

//Generate JWT
const generateToken = (userData)=>{
    const secret = process.env.JWT_SECRET || 'default-jwt-secret-for-development';
    return jwt.sign({
        id: userData._id,
        name: userData.name,
        email: userData.email
    }, secret, {
        expiresIn: '30d'
    })
}

//API to register user
export const registerUser = async (req,res)=>{
    const {name, email, password} = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Create new user in database
        const user = await User.create({
            name,
            email,
            password // Will be hashed by pre-save middleware
        });

        const token = generateToken({
            _id: user._id,
            name: user.name,
            email: user.email
        });

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.json({ success: false, message: error.message });
    }
}


//API to login user
export const loginUser = async (req, res) =>{
    const { email, password} = req.body;
    try {
        // Find user in database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken({
                _id: user._id,
                name: user.name,
                email: user.email
            });

            res.json({
                success: true,
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            res.json({ success: false, message: "Invalid email or password" });
        }

    } catch (error) {
        console.error("Login error:", error);
        res.json({ success: false, message: error.message });
    }
}

//API to get user data
export const getUser = async (req, res)=>{
    try {
        // Since protect middleware is disabled, we can't rely on req.user
        // The client should handle user data from localStorage
        // Return null to indicate no authenticated user
        return res.json({success: true, user: null})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const getPublishedImages = async (req, res) => {
  try {
    const chats = await Chat.find(
      { "messages.isPublished": true },
      { messages: 1, userId: 1 }
    ).populate("userId", "name");

    const images = [];

    chats.forEach(chat => {
      chat.messages.forEach(msg => {
        if (msg.isImage && msg.isPublished) {
          images.push({
            imageUrl: msg.content,
            userName: chat.userId?.name || "Unknown"
          });
        }
      });
    });

    return res.json({ success: true, images });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
