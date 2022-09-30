const { describe, expect, test } = require("@jest/globals");
const { xml2js } = require("xml-js");
const { getTestFiles } = require("./getTestFiles");
const { packSynapse } = require("./packSynapse");

describe("packSynapse", () => {
  test("combines single synapse link configuration with synapse workspace into solution", () =>
    testPackSynapse("single-config-with-synapse"));
  test("combines single synapse link configuration without synapse workspace into solution", () =>
    testPackSynapse("single-config-without-synapse"));
  test("combines multiple synpase link configurations into solution", () =>
    testPackSynapse("multiple-configs"));
  test("does nothing when no link configurations are found", () =>
    testPackSynapse("zero-configs"));
});

async function testPackSynapse(testName) {
  // Arrange
  const {
    packedXml,
    unpackedConfigJson,
    unpackedEnvironmentJson,
    unpackedXml,
  } = await getTestFiles(testName);

  // Act
  const outputXml = packSynapse({
    unpackedConfigJson: JSON.parse(unpackedConfigJson),
    unpackedEnvironmentJson: JSON.parse(unpackedEnvironmentJson),
    unpackedXml,
  });

  // Assert
  expect(xml2js(outputXml)).toEqual(xml2js(packedXml));
}
