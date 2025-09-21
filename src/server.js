import express from "express";
import { searchTests, generateFeature } from "./tools.js";
import { sendSlackNotification } from "./slack.js";

const app = express();
app.use(express.json());

app.get("/search", async (req, res) => {
  const { query } = req.query;
  const results = await searchTests(query);
  res.json(results);
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  const feature = await generateFeature(prompt);
  await sendSlackNotification(`✨ New test generated from prompt: "${prompt}"\n\n\`\`\`gherkin\n${feature}\n\`\`\``);
  res.json({ feature });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 MCP server running on http://localhost:${PORT}`);
});
