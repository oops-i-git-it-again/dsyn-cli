const { createWriteStream } = require("fs");
const { ZipFile } = require("yazl");
const { open } = require("yauzl");

async function zipMap(zipPath, filePath, mapper) {
  const newZip = new ZipFile();
  await new Promise((resolve, reject) => {
    open(zipPath, { lazyEntries: true }, (error, oldZip) => {
      if (error) {
        reject(error);
        return;
      }
      oldZip.on("entry", (entry) => {
        if (/\/$/.test(entry.fileName)) {
          oldZip.readEntry();
        } else {
          oldZip.openReadStream(entry, (error, readStream) => {
            if (error) {
              reject(error);
              return;
            }
            if (entry.fileName === filePath) {
              const chunks = [];
              readStream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
              readStream.on("error", reject);
              readStream.on("end", () =>
                newZip.addBuffer(
                  Buffer.from(mapper(Buffer.concat(chunks).toString("utf8"))),
                  entry.fileName
                )
              );
            } else {
              newZip.addReadStream(readStream, entry.fileName);
            }
            readStream.on("end", () => oldZip.readEntry());
          });
        }
      });
      oldZip.on("end", () => resolve());
      oldZip.readEntry();
    });
  });
  return new Promise((resolve) => {
    newZip.outputStream
      .pipe(createWriteStream(zipPath))
      .on("close", () => resolve());
    newZip.end();
  });
}
exports.zipMap = zipMap;
