const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const messageSchema = new Schema({
  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat", // Reference to the Chat model
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "users", // Reference to the User model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

const validateMessage = (message) => {
  const schema = Joi.object({
    chat: Joi.string().required(),
    sender: Joi.string().required(),
    content: Joi.string().required(),
  });
  return schema.validate(message);
};

module.exports = { Message, validateMessage };
