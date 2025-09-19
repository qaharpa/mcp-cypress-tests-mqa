from qdrant_client import QdrantClient
from config.settings import settings

def get_qdrant_client():
    return QdrantClient(
        host=settings["qdrant"]["host"],
        port=settings["qdrant"]["port"]
    )
