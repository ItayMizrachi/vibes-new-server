const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    newPassword: String,
    gender: String,
    user_name: String,
    userPosts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userPosts",
    },
    desc: {
        type: String, default: ""
    },
    city: {
        type: String, default: ""
    },
    profilePic: {
        type: String, default: ""
    },
    coverPic: {
        type: String, default: ""
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Referring to the same User model
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Referring to the same User model
    }],
    saved_posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    liked_posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    relationship: {
        type: Number, enum: [1, 2, 3],
    },
    date_created: {
        type: Date, default: Date.now
    },
    role: {
        type: String, default: "user"
    },
})
exports.UserModel = mongoose.model("users", userSchema);
//const user = module.exports = mongoose.model("users", userSchema);

exports.createToken = (user_id, role, user_followings, email, user_name) => {
    let token = jwt.sign({ _id: user_id, role: role, followings: user_followings, email: email, user_name: user_name }, config.tokenSecret, { expiresIn: "600mins" });

    return token;
}



exports.validateUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(200).required(),
        email: Joi.string().min(2).max(100).email().required(),
        password: Joi.string().min(3).max(20).required(),
        user_name: Joi.string().min(3).max(16).required(),
        gender: Joi.string().min(1).max(10).required(),
        profilePic: Joi.string().min(3).max(999).allow(null, ""),
        coverPic: Joi.string().min(3).max(999).allow(null, ""),
        desc: Joi.string().min(1).max(100).allow(null, ""),
        city: Joi.string().min(1).max(50).allow(null, ""),
    })
    return joiSchema.validate(_reqBody)
}

exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        user_name: Joi.string().min(3).max(16).required(),
        password: Joi.string().min(6).max(20).required(),

    })
    return joiSchema.validate(_reqBody)
}

exports.validateChangePass = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(100).email().required(),
        password: Joi.string().min(6).max(20).required(),
        newPassword: Joi.string().min(6).max(20).required(),

    })
    return joiSchema.validate(_reqBody)
}

exports.validateUpdate = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.forbidden(),
        password: Joi.forbidden(),
        name: Joi.string().min(2).max(200).allow(null, ""),
        profilePic: Joi.string().min(3).max(999).allow(null, ""),
        coverPic: Joi.string().min(3).max(999).allow(null, ""),
        gender: Joi.string().min(1).max(10).allow(null, ""),
        desc: Joi.string().min(1).max(80).allow(null, ""),
        city: Joi.string().min(1).max(50).allow(null, ""),
        user_name: Joi.string().min(1).max(16).allow(null, ""),
    })
    return joiSchema.validate(_reqBody)
}

