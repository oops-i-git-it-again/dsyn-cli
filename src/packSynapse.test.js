const { describe, expect, test } = require("@jest/globals");
const { xml2js } = require("xml-js");
const { getTestFiles } = require("./getTestFiles");
const { packSynapse } = require("./packSynapse");

describe("packSynapse", () => {
  test("combines synapse configurations into solution", async () => {
    //Arrange
    const {
      packedXml,
      unpackedConfigJson,
      unpackedEnvironmentJson,
      unpackedXml,
    } = await getTestFiles();

    //Act
    const outputXml = packSynapse({
      unpackedConfigJson: JSON.parse(unpackedConfigJson),
      unpackedEnvironmentJson: JSON.parse(unpackedEnvironmentJson),
      unpackedXml,
    });

    //Assert
    expect(xml2js(outputXml)).toEqual(xml2js(packedXml));
  });
});
