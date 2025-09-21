import { embedText } from "./embeddings.js";
import { searchDocs } from "./qdrant.js";
import { queryLLM } from "./llm.js";

export async function searchTests(query) {
  const vector = await embedText(query);
  return searchDocs(vector, 5);
}

export async function generateFeature(userPrompt) {
  const context = `
You are a Cypress + Cucumber test assistant.
Write ONLY a valid Gherkin .feature file.
Do not add explanations or file paths.
Use this format:

Feature: <name>

  Scenario: <name>
    Given ...
    When ...
    Then ...

`;
  const prompt = `${context}\nUser request: ${userPrompt}`;
  return queryLLM(prompt);
}
