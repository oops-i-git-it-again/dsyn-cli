const { join } = require("path");
const { readFiles } = require("./readFiles");

function readFilesFromRoot(root, ...fileNames) {
  return readFiles(...fileNames.map((fileName) => join(root, fileName)));
}
exports.readFilesFromRoot = readFilesFromRoot;
