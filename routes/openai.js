const express = require("express");  
const router = express.Router();     
const dotenv = require("dotenv"); 
const { auth } = require("../auth/auth");   
dotenv.config();


router.post("/completions",auth, async (req, res) => {
    const options = {
        method: "POST",  
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_KEY}`, 
            "Content-Type": "application/json"  // Informing the server that we're sending JSON data
        },
        body: JSON.stringify({  // Convert JavaScript object to a JSON string
            model: "gpt-3.5-turbo",  // Specifying the model to use for the OpenAI request
            messages: [{ role: "user", content: req.body.message }],  // User's message to get a completion from GPT-3.5
            max_tokens: 100,  // Limit the response to a maximum of 100 tokens
        })
    }

    try {
        // Making the actual request to the OpenAI API with the given options
        const response = await fetch(`https://api.openai.com/v1/chat/completions`, options);
        
        // Parsing the JSON response from the API
        const data = await response.json();

        // Sending the received data back to the client
        res.send(data);
    } catch (error) {
        // If there's an error in the try block, log it to the console
        console.log(error);
    }
});

module.exports = router;
