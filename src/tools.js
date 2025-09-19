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
