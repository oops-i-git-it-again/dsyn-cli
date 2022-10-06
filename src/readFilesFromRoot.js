import { join } from "path";
import { readFiles } from "./readFiles.js";

export function readFilesFromRoot(root, ...fileNames) {
  return readFiles(...fileNames.map((fileName) => join(root, fileName)));
}
