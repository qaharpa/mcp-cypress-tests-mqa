# MCP Cypress Tests JS

An MCP server for Cypress tests powered by DeepSeek + Ollama + Qdrant.  
It allows you to embed Cypress step definitions, search them, and generate new tests.

---

## 📂 File Tree

mcp-cypress-tests-js/
├── config/
│ └── settings.json
├── src/
│ ├── server.js # Express MCP server
│ ├── ingestion.js # Load .feature + .js files
│ ├── embeddings.js # Generate embeddings
│ ├── qdrant.js # Qdrant client
│ ├── llm.js # Ollama wrapper
│ ├── tools.js # Search + generation logic
│ └── bootstrap.js # Initial indexing pipeline
├── package.json
└── README.md


---

## ⚙️ Prerequisites

Before running the server, make sure you have:

1. **Ollama installed**
    - macOS/Linux:
      ```bash
      curl -fsSL https://ollama.ai/install.sh | sh
      ```
    - Windows: [Download installer](https://ollama.ai/download)

2. **DeepSeek model pulled with Ollama**  
   Run once to download the model (choose size based on your hardware):
   ```bash
   ollama pull deepseek-r1

Verify Ollama is running:

curl http://localhost:11434/api/tags

    Qdrant running (vector database)
    Quick start with Docker:

docker run -p 6333:6333 qdrant/qdrant

Node.js installed (v18+)
Check with:

    node -v

🚀 How it Works
1. Bootstrap

Reads .feature + .js step definitions, generates embeddings via DeepSeek (Ollama), and stores them in Qdrant.

npm run bootstrap

2. Run MCP Server

npm start

3. Search Tests

Send a query to search for relevant tests:

curl "http://localhost:8000/search?query=login tests"

4. Generate New Test

Use the /generate endpoint to create new test features.

Example: password reset feature

curl -X POST http://localhost:8000/generate \
-H "Content-Type: application/json" \
-d '{"prompt":"Write a feature for password reset via email"}'

Example: login feature

curl -X POST http://localhost:8000/generate \
-H "Content-Type: application/json" \
-d '{"prompt":"Create a login feature"}'

✨ That’s it! With Ollama + DeepSeek powering embeddings, and Qdrant storing them, you can quickly search and generate Cypress tests.
