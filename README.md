📂 File Tree
mcp-cypress-tests-js/
├── config/
│   └── settings.json
├── src/
│   ├── server.js          # Express MCP server
│   ├── ingestion.js       # Load .feature + .js files
│   ├── embeddings.js      # Generate embeddings
│   ├── qdrant.js          # Qdrant client
│   ├── llm.js             # Ollama wrapper
│   ├── tools.js           # Search + generation logic
│   └── bootstrap.js       # Initial indexing pipeline
├── package.json
└── README.md

📄 package.json
{
  "name": "mcp-cypress-tests-js",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "bootstrap": "node src/bootstrap.js"
  },
  "dependencies": {
    "@qdrant/js-client-rest": "^1.8.0",
    "axios": "^1.6.7",
    "express": "^4.18.2",
    "glob": "^10.3.10"
  }
}

📄 config/settings.json
{
  "qdrant": {
    "host": "http://localhost:6333",
    "collection": "cypress_tests"
  },
  "ollama": {
    "model": "deepseek-coder",
    "baseUrl": "http://localhost:11434"
  },
  "repo": {
    "featurePath": "../your-cypress-repo/cypress/e2e/",
    "stepsPath": "../your-cypress-repo/cypress/support/step_definitions/"
  }
}

📄 src/ingestion.js
import fs from "fs";
import path from "path";
import glob from "glob";

export function loadFeatureFiles(dir) {
  const files = glob.sync(path.join(dir, "**/*.feature"));
  return files.map(f => ({ id: f, text: fs.readFileSync(f, "utf8") }));
}

export function loadStepDefinitions(dir) {
  const files = glob.sync(path.join(dir, "**/*.js"));
  return files.map(f => ({ id: f, text: fs.readFileSync(f, "utf8") }));
}

📄 src/embeddings.js
import axios from "axios";
import settings from "../config/settings.json" assert { type: "json" };

export async function embedText(text) {
  const response = await axios.post(`${settings.ollama.baseUrl}/api/embeddings`, {
    model: settings.ollama.model,
    prompt: text
  });
  return response.data.embedding;
}

export async function embedDocuments(docs) {
  return Promise.all(
    docs.map(async doc => ({
      id: doc.id,
      vector: await embedText(doc.text),
      payload: { text: doc.text, file: doc.id }
    }))
  );
}

📄 src/qdrant.js
import { QdrantClient } from "@qdrant/js-client-rest";
import settings from "../config/settings.json" assert { type: "json" };

const client = new QdrantClient({ url: settings.qdrant.host });

export async function ensureCollection() {
  const collections = await client.getCollections();
  const exists = collections.collections.some(c => c.name === settings.qdrant.collection);

  if (!exists) {
    await client.createCollection(settings.qdrant.collection, {
      vectors: { size: 4096, distance: "Cosine" } // DeepSeek embeddings size (adjust if needed)
    });
    console.log(`✅ Created Qdrant collection: ${settings.qdrant.collection}`);
  }
}

export async function upsertDocs(points) {
  await client.upsert(settings.qdrant.collection, { points });
}

export async function searchDocs(vector, limit = 5) {
  return client.search(settings.qdrant.collection, {
    vector,
    limit
  });
}

📄 src/llm.js
import axios from "axios";
import settings from "../config/settings.json" assert { type: "json" };

export async function queryLLM(prompt) {
  const response = await axios.post(`${settings.ollama.baseUrl}/api/generate`, {
    model: settings.ollama.model,
    prompt
  }, { responseType: "stream" });

  return new Promise((resolve, reject) => {
    let output = "";
    response.data.on("data", chunk => {
      try {
        const lines = chunk.toString().split("\n").filter(Boolean);
        for (const line of lines) {
          const parsed = JSON.parse(line);
          if (parsed.response) output += parsed.response;
        }
      } catch (err) {
        console.error("Parse error:", err);
      }
    });
    response.data.on("end", () => resolve(output));
    response.data.on("error", reject);
  });
}

📄 src/tools.js
import { embedText } from "./embeddings.js";
import { searchDocs } from "./qdrant.js";
import { queryLLM } from "./llm.js";

export async function searchTests(query) {
  const vector = await embedText(query);
  return searchDocs(vector, 5);
}

export async function generateFeature(userPrompt) {
  const context = "You are a Cypress+Cucumber assistant. Generate a new .feature file with realistic steps.";
  const prompt = `${context}\nUser request: ${userPrompt}`;
  return queryLLM(prompt);
}

📄 src/bootstrap.js
import settings from "../config/settings.json" assert { type: "json" };
import { loadFeatureFiles, loadStepDefinitions } from "./ingestion.js";
import { embedDocuments } from "./embeddings.js";
import { ensureCollection, upsertDocs } from "./qdrant.js";

async function bootstrap() {
  await ensureCollection();

  const features = loadFeatureFiles(settings.repo.featurePath);
  const steps = loadStepDefinitions(settings.repo.stepsPath);
  const docs = [...features, ...steps];

  console.log(`📦 Loaded ${docs.length} documents from repo.`);

  const vectors = await embedDocuments(docs);
  await upsertDocs(vectors);

  console.log(`✅ Indexed ${vectors.length} documents into Qdrant.`);
}

bootstrap();

📄 src/server.js
import express from "express";
import { searchTests, generateFeature } from "./tools.js";

const app = express();
app.use(express.json());

app.get("/search", async (req, res) => {
  const { query } = req.query;
  const results = await searchTests(query);
  res.json(results);
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  const feature = await generateFeature(prompt);
  res.json({ feature });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 MCP server running on http://localhost:${PORT}`);
});

🚀 How it Works

1. Bootstrap

    npm run bootstrap

Reads .feature + .js step defs

Embeds with DeepSeek via Ollama

Stores in Qdrant

2. Run MCP server

    npm start

3. Search tests

    GET http://localhost:8000/search?query=login tests

4. Generate new test

POST http://localhost:8000/generate
{
  "prompt": "Write a feature for password reset via email"
}