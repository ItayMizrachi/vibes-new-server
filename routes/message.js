const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");  // Your authentication middleware
const { Message, validateMessage } = require("../models/messageModel");

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

// Send a new message to a chat
router.post("/:chatId", auth, async (req, res) => {
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
