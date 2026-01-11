import Chat from "../models/Chat.js"


//API controller for creating a new chat
export const createChat = async (req,res) => {
    try {
        // Use mock user for now (since protect middleware is disabled)
        const userId = 'mock-user-id';
        const userName = 'Test User';

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName
        }

        const chat = await Chat.create(chatData)
        res.json({success: true, message: "Chat created", chat})
    } catch (error) {
        console.error("Create chat error:", error);
        res.json({success: false, message: error.message});
    }
}

//API controller for getting all chat
export const getChats = async (req,res) => {
    try {
        // Use mock user for now (since protect middleware is disabled)
        const userId = 'mock-user-id';

        const chats = await Chat.find({userId}).sort({ updatedAt: -1 })

        console.log(`Found ${chats.length} chats for mock user`);
        res.json({success: true, chats})
    } catch (error) {
        console.error("❌ Get chats error:", error);
        res.json({success: false, message: error.message});
    }
}

//API controller for deleting a chat
export const deleteChats = async (req,res) => {
    try {
        // Use mock user for now (since protect middleware is disabled)
        const userId = 'mock-user-id';
        const { chatId } = req.body

        await Chat.deleteOne({_id: chatId, userId})

        console.log(`Deleted chat ${chatId} for mock user`);
        res.json({success: true, message: "Chat Deleted"})
    } catch (error) {
        console.error("Delete chat error:", error);
        res.json({success: false, message: error.message});
    }
}

