import fs from "fs";
import path from "path";
import glob from "glob";

export function loadFeatureFiles(dir) {
  const files = glob.sync(path.join(dir, "**/*.feature"));
  return files.map(f => ({ id: f, text: fs.readFileSync(f, "utf8") }));
}

export function loadStepDefinitions(dir) {
  const files = glob.sync(path.join(dir, "**/*.js"));
  return files.map(f => ({ id: f, text: fs.readFileSync(f, "utf8") }));
}
