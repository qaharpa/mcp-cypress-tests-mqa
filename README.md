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


curl -X POST http://localhost:8000/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"Create a login feature\"}"