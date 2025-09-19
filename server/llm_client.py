import requests
from config.settings import settings

OLLAMA_URL = settings["ollama"]["base_url"]
MODEL = settings["ollama"]["model"]

def query_llm(prompt: str):
    response = requests.post(
        f"{OLLAMA_URL}/api/generate",
        json={"model": MODEL, "prompt": prompt},
    )
    return response.json()["response"]
