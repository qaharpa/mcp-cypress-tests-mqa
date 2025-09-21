import axios from "axios";
import settings from "../config/settings.json" with { type: "json" };

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
