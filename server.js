import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

const API_KEY = 'AIzaSyAeShwG7GBIHtrWjSkU2i6cY4DR8JffR1I';
const MODEL_NAME = 'gemini-2.5-flash-preview-05-20';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

app.use(express.json());
app.use(express.static('public'));

//chat endpoint
app.post('/api/chat', async (req, res) =>
{
    const prompt = req.body.prompt;

    if (!prompt) 
    {
        return res.status(400).json({ error: 'Please provide a prompt' });
    }

    //request for Gemini API
    const payload = 
    {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "You are a friendly AI assistant" }] }
    };

    try 
    {
        const response = await fetch(API_URL, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) 
        {
            return res.status(response.status).json({ error: data.error?.message || 'API Error' });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, AI could not generate a response";
        res.json({ text: text });
    } 
    catch (err) 
    {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => 
{
    console.log(`Server running at http://localhost:${PORT}`);
});