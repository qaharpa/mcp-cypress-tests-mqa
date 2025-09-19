from .qdrant_client import get_qdrant_client
from .llm_client import query_llm

def search_tests(query, collection="cypress_tests"):
    client = get_qdrant_client()
    results = client.search(
        collection_name=collection,
        query_vector=query, limit=5
    )
    return results

def generate_new_feature(user_prompt: str):
    context = "You are a Cypress+Cucumber assistant..."
    prompt = f"{context}\nUser request: {user_prompt}"
    return query_llm(prompt)
