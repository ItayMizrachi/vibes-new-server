const express = require("express");
const router = express.Router();
const { auth } = require("../auth/auth.js"); // Your authentication middleware
const { Chat, validateChat } = require("../models/chatModel");
const { Message, validateMessage } = require("../models/messageModel");

const ITEMS_PER_PAGE = 20;
// Get chats for a specific user
router.get("/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    // Query the database for chats with the user as a participant and sort by last_updated
    const userChats = await Chat.find({ participants: userId })
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)  
    .populate("participants", "user_name profilePic")
      .sort({ last_updated: -1 }) // Sort in descending order (latest first)
      .exec();

    res.status(200).json(userChats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get messages for a specific chat
router.get("/:chatId/messages", auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "user_name profilePic") 
      .exec();

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//creates a new chat
router.post("/", auth, async (req, res) => {
  try {
    const participants = req.body.participants; // Array of participant IDs

    // Check if a chat with the same participants already exists
    const existingChat = await Chat.findOne({
      participants: { $all: participants },
    });

    if (existingChat) {
      return res.status(400).json({
        error: "Chat with these participants already exists",
        existingChat: existingChat,
      });
    }

    const newChat = new Chat({
      participants: participants,
    });

    // Save the new chat in the database
    await newChat.save();

    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update isRead status for all messages in a chat
// router.put("/:chatId/mark-read", auth, async (req, res) => {
//   try {
//     const chatId = req.params.chatId;

//     // Update isRead status for all messages in the chat
//     await Message.updateMany({ chat: chatId }, { $set: { isRead: true } });

//     // Update isRead status for the chat itself
//     await Chat.findByIdAndUpdate(chatId, { $set: { isRead: true } });

//     res.status(200).json({ message: "Chat marked as read" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


module.exports = router;
