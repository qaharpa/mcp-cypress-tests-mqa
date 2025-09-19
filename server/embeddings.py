from langchain.embeddings import OllamaEmbeddings
from .qdrant_client import get_qdrant_client

def index_documents(docs, collection="cypress_tests"):
    client = get_qdrant_client()
    embeddings = OllamaEmbeddings(model="deepseek-coder")

    payloads = []
    vectors = []

    for doc_id, text in docs:
        vector = embeddings.embed_query(text)
        vectors.append(vector)
        payloads.append({"id": doc_id, "text": text})

    client.upsert(
        collection_name=collection,
        points=[
            {"id": i, "vector": vectors[i], "payload": payloads[i]}
            for i in range(len(docs))
        ],
    )
