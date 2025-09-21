import axios from "axios";
import settings from "../config/settings.json" with { type: "json" };

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
