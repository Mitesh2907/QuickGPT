import axios from "axios";
import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import groq from "../configs/groq.js";
import imagekit from "../configs/imageKit.js";
// dotenv is already configured in server.js



// ===============================
// 1️⃣ TEXT MESSAGE CONTROLLER
// ===============================

export const textMessageController = async (req, res) => {
  try {
    // Use mock user for now (since protect middleware is disabled)
    const userId = 'mock-user-id';
    const { chatId, prompt } = req.body;

    console.log("Message request - userId:", userId, "chatId:", chatId, "prompt length:", prompt?.length);



    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    // Call Groq AI API
    let botReply;
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      });
      botReply = completion.choices[0].message.content;
    } catch (apiError) {
      // Fallback response when API is not available
      botReply = `I'm sorry, but I'm currently unable to process your request due to API limitations. You asked: "${prompt}"

Please make sure the GROQ_API_KEY environment variable is set for full AI functionality.`;
    }

    const reply = {
      role: "assistant",
      content: botReply,
      timeStamp: Date.now(),
      isImage: false
    };

    // Save messages to database if chatId provided
    if (chatId) {
      console.log("💾 Saving messages to chat:", chatId, "for user:", userId);
      try {
        // Check if database is connected
        const isConnected = mongoose.connection.readyState === 1;
        console.log("Database connected:", isConnected);

        if (!isConnected) {
          console.log("⚠️ Database not connected, skipping message save");
          return;
        }

        // First, let's see all chats for this user
        const allChats = await Chat.find({ userId });
        console.log("📋 All chats for user:", allChats.map(c => ({ id: c._id.toString(), name: c.name, messages: c.messages?.length || 0 })));

        const chat = await Chat.findOne({ _id: chatId, userId });
        console.log("🔍 Looking for chat with _id:", chatId, "and userId:", userId);
        console.log("✅ Found specific chat:", chat ? {
          id: chat._id.toString(),
          name: chat.name,
          messages: chat.messages?.length || 0,
          userId: chat.userId
        } : "❌ No chat found");

        if (!chat) {
          console.log("🚨 Chat not found! This is why messages aren't saved.");
          console.log("💡 Available chats for this user:", allChats.length);
          console.log("💡 Chat IDs:", allChats.map(c => c._id.toString()));
          return;
        }

        // Save messages
        const userMessage = {
          role: "user",
          content: prompt,
          timeStamp: Date.now(),
          isImage: false
        };

        chat.messages.push(userMessage);
        chat.messages.push(reply);

        console.log("📝 Adding messages to chat:", {
          userMessage: userMessage.content.substring(0, 50) + "...",
          aiReply: reply.content.substring(0, 50) + "..."
        });

        const savedChat = await chat.save();
        console.log("✅ Messages saved successfully! Chat now has", savedChat.messages.length, "messages");

      } catch (dbError) {
        console.error("❌ Database save error:", dbError);
        console.error("❌ Error details:", {
          message: dbError.message,
          name: dbError.name,
          code: dbError.code
        });
      }
    } else {
      console.log("⚠️ No chatId provided, messages not saved to database");
    }

    res.json({ success: true, reply });

  } catch (error) {
    console.log("GROQ TEXT ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};


// ===============================
// 2️⃣ IMAGE MESSAGE CONTROLLER
// ===============================
export const imageMessageController = async (req, res) => {
  try {
    const { prompt, chatId, isPublished } = req.body;

    // Validate input
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    // Mock image generation response
    const mockImageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;

    const reply = {
      role: "assistant",
      content: mockImageUrl,
      timeStamp: Date.now(),
      isImage: true,
      isPublished: isPublished || false
    };

    res.json({ success: true, reply });

  } catch (error) {
    console.error("Image message error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
