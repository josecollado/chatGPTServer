const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!DISCORD_WEBHOOK_URL || !OPENAI_API_KEY) {
    console.error("Essential environment variables are missing!");
    process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(cors());

app.post('/ask', async (req, res) => {
  console.log('Received request:', req.body);
  
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "system", content: req.body.prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 80
    });
    
    const responseContent = chatCompletion.choices[0].message.content;
    console.log('sending response to user');
    
    res.json(responseContent);
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: '<><><><>MESSAGE SENT @here<><><><>'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
    
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: `<><><><>MESSAGE ERROR @here<><><><>\nERROR: ${error}`
    });
  }
});

app.get('/', (req, res) => {
    res.json({ status: "Server is running" });
});

app.listen(PORT, '0.0.0.0', async () => {
  await axios.post(DISCORD_WEBHOOK_URL, {
    content: '<><><><><>GPT SERVER RUNNING @here<><><><><>'
  });
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
