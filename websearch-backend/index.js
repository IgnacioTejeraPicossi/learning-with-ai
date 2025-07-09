const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI key in .env or environment
});

app.post("/web-search", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "No query provided" });

  try {
    // Try web search tool first
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview", // or "gpt-4.1" if available
        messages: [{ role: "user", content: query }],
        tools: [{ type: "web_search_preview" }], // Try web_search_preview first
        tool_choice: "auto",
      });
      return res.json({ result: response.choices[0].message.content });
    } catch (err) {
      // If web search tool fails, fall back to standard LLM
      console.warn("Web search tool failed, falling back to standard LLM:", err.message);
      const fallback = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [{ role: "user", content: query }],
      });
      return res.json({ result: fallback.choices[0].message.content });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "OpenAI error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Web search backend running on port ${PORT}`)); 