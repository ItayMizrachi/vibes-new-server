// const express = require("express");
// const router = express.Router();
// const dotenv = require("dotenv");
// dotenv.config();

// const { Configuration, OpenAIApi } = require("openai")
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_KEY,
// });
// const openai = new OpenAIApi(configuration);

// router.post("/", async (req, res) => {
//     try {
//         const response = await openai.createImage({
//             prompt: req.body.prompt,
//             n: 2,
//             size: "1024x1024",
//         });
//         res.send(response.data.data);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(502).json({ err })
//     }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { auth } = require("../auth/auth");
dotenv.config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEYSASHA,
});
const openai = new OpenAIApi(configuration);

router.post("/", auth, async (req, res) => {
    try {
        const response = await openai.createImage({
            prompt: req.body.prompt,
            n: 1,
            size: "1024x1024",
            response_format: 'b64_json'  // Fixed this line
        });
        
        // Set appropriate CORS headers
        res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        res.send(response.data.data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
});

module.exports = router;
