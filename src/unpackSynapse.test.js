const { describe, expect, test } = require("@jest/globals");
const { xml2js } = require("xml-js");
const { getTestFiles } = require("./getTestFiles");
const unpackSynapse = require("./unpackSynapse.js");

describe("unpackSynapse", () => {
  test("splits synapse customizations from solution", async () => {
    //  Arrange
    const {
      packedXml,
      unpackedXml,
      unpackedConfigJson,
      unpackedEnvironmentJson,
    } = await getTestFiles();

    //  Act
    const output = unpackSynapse(packedXml);

    //  Assert
    expect(output).toHaveProperty("unpackedXml");
    expect(xml2js(output.unpackedXml)).toEqual(xml2js(unpackedXml));

    expect(output).toHaveProperty("unpackedConfigJson");
    expect(output.unpackedConfigJson).toEqual(JSON.parse(unpackedConfigJson));

    expect(output).toHaveProperty("unpackedEnvironmentJson");
    expect(output.unpackedEnvironmentJson).toEqual(
      JSON.parse(unpackedEnvironmentJson)
    );
  });

  // TODO: support multiple synapse configs
  // TODO: support 0 synapse configs
  // TODO: Support Synapse config without workspaces
});
