const express = require("express");
const router = express.Router();
const { auth } = require("../auth/auth");  // Your authentication middleware
const { Message, validateMessage } = require("../models/messageModel");
const { UserModel } = require("../models/userModel");
const { Chat } = require("../models/chatModel");


// Get all messages for a specific chat
router.get("/:chatId", auth, async (req, res) => {
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

router.post("/", async (req, res) => {
  try {
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const message = new Message({
      chat: req.body.chat,
      sender: req.body.sender,
      content: req.body.content,
    });

    // Update unread count and mark the chat as unread
    const chat = await Chat.findById(req.body.chat);
    chat.unreadCount += 1;

    // Update last_updated field to current date and time
    chat.last_updated = new Date();

    await chat.save();
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.put("/mark-as-read/:chatId", async (req, res) => {
//   try {
//     const chatId = req.params.chatId;
//     // Reset unread count and mark the chat as read
//     const chat = await Chat.findById(chatId);
//     chat.unreadCount = 0;
//     await chat.save();
//     res.status(200).json({ message: "isRead marked as read" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

module.exports = router;
