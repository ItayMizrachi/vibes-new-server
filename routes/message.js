const express = require("express");
const router = express.Router();
const { auth } = require("../auth/auth");  // Your authentication middleware
const { Message, validateMessage } = require("../models/messageModel");
const { UserModel } = require("../models/userModel");

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
router.post("/", async (req, res) => {
  try {
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const message = new Message({
      chat: req.body.chat,
      sender: req.body.sender,
      content: req.body.content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.post("/:chatId",auth, async (req, res) => {
//   let validBody = validateMessage(req.body);
//   if (validBody.error) {
//       console.log("not valid body")
//       return res.status(400).json(validBody.error.details)
//   }
//   try {
//       let message = new Message(req.body);
//       message.chat = req.params.chatId;
//       message.content = req.body.content;
//       let user = await UserModel.findById(req.tokenData._id);
//       message.sender = user._id;
//       await message.save();
//       res.status(201).json(message);
//   }
//   catch (err) {
//       console.log(err);
//       res.status(502).json({ msg: "An error occurred while trying to save the post." })
//   }
// })


module.exports = router;
