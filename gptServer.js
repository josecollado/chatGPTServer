const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors');
const axios = require('axios');




dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
const app = express();
const PORT = 3005;

app.use(bodyParser.json());
app.use(cors());

app.post('/ask', async (req, res) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "system", content: req.body.prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 80
    });
    res.json(chatCompletion.choices[0].message.content);
    console.log('sending response to user')
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: '<><><><><><><><>MESSAGE SENT<><><><><><><><><><>'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: `<><><><><><><>MESSAGE ERROR<><><><><><><><
            ERROR: ${error}`
    });
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  await axios.post(DISCORD_WEBHOOK_URL, {
    content: '<><><><><><><><><>GPT SERVER RUNNING<><><><><><><><><>'
  });
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

