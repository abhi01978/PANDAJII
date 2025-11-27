require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Groq } = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === '') {
    return res.json({ answer: "भाई, कुछ तो पूछो ना!" });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "तू एक बहुत प्यारा, मस्तीखोर और समझदार Panda Guru है। हिंदी + थोड़ी इंग्लिश मिलाकर छोटे-छोटे, मज़ेदार और बिल्कुल साफ जवाब देता है। बच्चों को प्यार से समझाता है और कभी-कभी मज़ाक भी करता है। हमेशा खुश और energetic रहता है!"
        },
        {
          role: "user",
          content: question
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 600
    });

    const answer = completion.choices[0]?.message?.content?.trim() || "अरे यार, कुछ गड़बड़ हो गई!";
    res.json({ answer });

  } catch (error) {
    console.error("Groq Error:", error.message);
    res.json({ answer: "सर्वर थोड़ा सो रहा है, 10 सेकंड बाद फिर ट्राई करो!" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Panda Guru LIVE है → http://localhost:${PORT}`);
  console.log(`API Key मिली? → ${process.env.GROQ_API_KEY ? "हाँ" : "नहीं"}`);
});