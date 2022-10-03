const { join } = require("path");
const { readFilesFromRoot } = require("./readFilesFromRoot");

function readTestFiles(testName, ...fileNames) {
  return readFilesFromRoot(
    join(__dirname, "..", "test", testName),
    ...fileNames
  );
}
exports.readTestFiles = readTestFiles;
