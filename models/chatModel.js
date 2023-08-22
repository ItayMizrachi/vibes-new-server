const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const chatSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "users", // Reference to the User model
    required: true,
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: "Message",
  }],
  date_created: {
    type: Date,
    default: Date.now,
  },
  last_updated: {
    type: Date,
    default: Date.now, // Set to the current date and time when the chat is created
  },
  unreadCount: {
    type: Number,
    default: 0, // Set to 0 by default
  },
});

const Chat = mongoose.model("Chat", chatSchema);

const validateChat = (chat) => {
  const schema = Joi.object({
    participants: Joi.array().items(Joi.string().required()).required(),
  });
  return schema.validate(chat);
};

module.exports = { Chat, validateChat };
