import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ollama from 'ollama';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/' , (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const response = await ollama.chat({
      model: 'deepseek-r1:1.5b',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: response.message.content });
  } catch (error) {
    console.error('Ollama Chat Error:', error);
    res.status(500).json({ error: 'Failed to communicate with DeepSeek model.' });
  }
});

app.listen(PORT, () => {
  console.log(`Express Server running on http://localhost:${PORT}`);
});