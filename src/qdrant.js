import { QdrantClient } from "@qdrant/js-client-rest";
import settings from "../config/settings.json" assert { type: "json" };

const client = new QdrantClient({ url: settings.qdrant.host });

export async function ensureCollection() {
  const collections = await client.getCollections();
  const exists = collections.collections.some(c => c.name === settings.qdrant.collection);

  if (!exists) {
    await client.createCollection(settings.qdrant.collection, {
      vectors: { size: 4096, distance: "Cosine" } // DeepSeek embeddings size (adjust if needed)
    });
    console.log(`✅ Created Qdrant collection: ${settings.qdrant.collection}`);
  }
}

export async function upsertDocs(points) {
  await client.upsert(settings.qdrant.collection, { points });
}

export async function searchDocs(vector, limit = 5) {
  return client.search(settings.qdrant.collection, {
    vector,
    limit
  });
}
