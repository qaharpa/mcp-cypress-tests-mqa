import settings from "../config/settings.json" assert { type: "json" };
import { loadFeatureFiles, loadStepDefinitions } from "./ingestion.js";
import { embedDocuments } from "./embeddings.js";
import { ensureCollection, upsertDocs } from "./qdrant.js";

async function bootstrap() {
  await ensureCollection();

  const features = loadFeatureFiles(settings.repo.featurePath);
  const steps = loadStepDefinitions(settings.repo.stepsPath);
  const docs = [...features, ...steps];

  console.log(`📦 Loaded ${docs.length} documents from repo.`);

  const vectors = await embedDocuments(docs);
  await upsertDocs(vectors);

  console.log(`✅ Indexed ${vectors.length} documents into Qdrant.`);
}

bootstrap();
