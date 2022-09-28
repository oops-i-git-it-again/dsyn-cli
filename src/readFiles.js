const { readFile } = require("fs/promises");

function readFiles(...filePaths) {
  return Promise.all(
    filePaths.map(async (filePath) => {
      const buffer = await readFile(filePath);
      return buffer.toString();
    })
  );
}
exports.readFiles = readFiles;
