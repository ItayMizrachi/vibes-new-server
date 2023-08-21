const express = require("express");
const router = express.Router();
const auth = require("../auth/auth"); // Your authentication middleware
const { Chat, validateChat } = require("../models/chatModel");
const { Message, validateMessage } = require("../models/messageModel");


// Get all chats for a user
router.get("/", auth, async (req, res) => {
  try {
      const userChats = await Chat.find({ participants: req.user._id })
      .populate("participants", "user_name profilePic") // Optional: Populate participants
      .exec();
      
      res.json(userChats);
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
        .populate("sender", "user_name profilePic") // Optional: Populate sender
        .exec();
        
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new chat
router.post("/", auth, async (req, res) => {
  try {
    const { error } = validateChat(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const chat = new Chat({
      participants: req.body.participants,
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send a new message to a chat
router.post("/:chatId/messages", auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const { error } = validateMessage(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      content: req.body.content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
