import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import groq from "../configs/groq.js";
import imagekit from "../configs/imageKit.js";
import "dotenv/config";



// ===============================
// 1️⃣ TEXT MESSAGE CONTROLLER
// ===============================

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    if (req.user.credits < 1) {
      return res.json({ success: false, message: "Not enough credits" });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    });

    const botReply = completion.choices[0].message.content;

    const reply = {
      role: "assistant",
      content: botReply,
      timeStamp: Date.now(),
      isImage: false
    };

    res.json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

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
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({ success: false, message: "Not enough credits" });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    // USER MESSAGE
    chat.messages.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false
    });

    // Stable Diffusion API Call
    const apiUrl =
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0";

    const sdResponse = await axios.post(
      apiUrl,
      {
        inputs: prompt,
        parameters: {
          width: 1024,
          height: 1024,
          num_inference_steps: 50,
          guidance_scale: 7.5
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "image/png"
        },
        responseType: "arraybuffer"
      }
    );

    const base64Image =
      `data:image/png;base64,${Buffer.from(sdResponse.data).toString("base64")}`;

    const uploaded = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt"
    });

    const reply = {
      role: "assistant",
      content: uploaded.url,
      timeStamp: Date.now(),
      isImage: true,
      isPublished
    };

    // Send reply to frontend
    res.json({ success: true, reply });

    // Save chat
    chat.messages.push(reply);
    await chat.save();

    // Deduct credits
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

  } catch (error) {
    console.log("IMAGE GENERATION ERROR:", error);
    return; // ❗ Stop here — DO NOT send res.json again
  }
};
