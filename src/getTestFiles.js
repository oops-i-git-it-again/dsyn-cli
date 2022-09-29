const { join } = require("path");
const { readFilesFromRoot } = require("./readFilesFromRoot");

async function getTestFiles(testName) {
  const [packedXml, unpackedXml, unpackedConfigJson, unpackedEnvironmentJson] =
    await readTestFiles(
      testName,
      "packed.xml",
      "unpacked.xml",
      "unpacked-config.json",
      "unpacked-environment.json"
    );
  return {
    packedXml,
    unpackedXml,
    unpackedConfigJson,
    unpackedEnvironmentJson,
  };
}
exports.getTestFiles = getTestFiles;

function readTestFiles(testName, ...fileNames) {
  return readFilesFromRoot(
    join(__dirname, "..", "test", testName),
    ...fileNames
  );
}
