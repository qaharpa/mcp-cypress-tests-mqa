from fastapi import FastAPI
from .tools import search_tests, generate_new_feature

app = FastAPI()

@app.get("/search")
def search(query: str):
    return search_tests(query)

@app.post("/generate")
def generate(prompt: str):
    return {"feature": generate_new_feature(prompt)}
