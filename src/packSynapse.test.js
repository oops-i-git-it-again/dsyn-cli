const { describe, expect, test } = require("@jest/globals");
const { xml2js } = require("xml-js");
const { getTestFiles } = require("./getTestFiles");
const { packSynapse } = require("./packSynapse");

describe("packSynapse", () => {
  test("combines single synapse link configuration with synapse workspace into solution", async () => {
    //Arrange
    const {
      packedXml,
      unpackedConfigJson,
      unpackedEnvironmentJson,
      unpackedXml,
    } = await getTestFiles("single-config-with-synapse");

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
