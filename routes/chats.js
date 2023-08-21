const express = require("express");
const router = express.Router();
const {auth} = require("../auth/auth.js"); // Your authentication middleware
const { Chat, validateChat } = require("../models/chatModel");
const { Message, validateMessage } = require("../models/messageModel");

// Get chats for a specific user
router.get("/:userId",auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query the database for chats with the user as a participant
    const userChats = await Chat.find({ participants: userId })
      .populate("participants", "user_name profilePic")
      .exec();

    res.status(200).json(userChats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get messages for a specific chat
router.get("/:chatId/messages",auth,  async (req, res) => {
    try {
        const chatId = req.params.chatId;
        
        const messages = await Message.find({ chat: chatId })
        .populate("sender", "user_name profilePic") // Optional: Populate sender
        .exec();
        
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new chat
router.post("/",auth,  async (req, res) => {
  try {
    const participants = req.body.participants; // Array of participant IDs

    // Validate participants or any other required data

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

module.exports = router;
