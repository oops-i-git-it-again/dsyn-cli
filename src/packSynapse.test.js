const { describe, expect, test } = require("@jest/globals");
const { getTestFiles } = require("./getTestFiles");
const { packSynapse } = require("./packSynapse");
const { readTestFiles } = require("./readTestFiles");

describe("packSynapse", () => {
  test("combines single synapse link configuration with synapse workspace into solution", () =>
    testPackSynapse("single-config-with-synapse"));
  test("combines single synapse link configuration without synapse workspace into solution", () =>
    testPackSynapse("single-config-without-synapse"));
  test("combines multiple synpase link configurations into solution", () =>
    testPackSynapse("multiple-configs"));
  test("does nothing when no link configurations are found", () =>
    testPackSynapse("zero-configs"));
  test("excludes environment information when none is provided", async () => {
    // Arrange
    const [packedXml, unpackedConfigJson, unpackedXml] = await readTestFiles(
      "pack-without-environment",
      "packed.xml",
      "unpacked-config.json",
      "unpacked.xml"
    );

    // Act
    const outputXml = packSynapse({
      unpackedConfigJson: JSON.parse(unpackedConfigJson),
      unpackedXml,
    });

    // Assert
    expect(outputXml).toMatchCustomizationsXml(packedXml);
  });
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
  expect(outputXml).toMatchCustomizationsXml(packedXml);
}
