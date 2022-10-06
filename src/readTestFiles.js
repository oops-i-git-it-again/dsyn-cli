import { join } from "path";
import { readFilesFromRoot } from "./readFilesFromRoot.js";

export function readTestFiles(testName, ...fileNames) {
  return readFilesFromRoot(
    join(getCurrentDirectory(), "..", "test", testName),
    ...fileNames
  );
}

function getCurrentDirectory() {
  return new URL(import.meta.url).pathname.split("/").slice(0, -1).join("/");
}
