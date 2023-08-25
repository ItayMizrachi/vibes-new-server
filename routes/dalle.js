const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const { Configuration, OpenAIApi } = require("openai")
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/", async (req, res) => {
    try {
        const response = await openai.createImage({
            prompt: req.body.prompt,
            n: 2,
            size: "1024x1024",
        });
        res.send(response.data.data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
});

module.exports = router;
