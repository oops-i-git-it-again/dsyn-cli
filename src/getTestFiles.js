const { join } = require("path");
const { readFilesFromRoot } = require("./readFilesFromRoot");

async function getTestFiles() {
  const [packedXml, unpackedXml, unpackedConfigJson, unpackedEnvironmentJson] =
    await readTestFiles(
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

function readTestFiles(...fileNames) {
  return readFilesFromRoot(join(__dirname, "..", "test"), ...fileNames);
}
