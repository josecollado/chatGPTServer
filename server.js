const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors');



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
    console.log('sending response')
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
