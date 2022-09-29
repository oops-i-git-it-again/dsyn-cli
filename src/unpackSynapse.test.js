const { describe, expect, test } = require("@jest/globals");
const { xml2js } = require("xml-js");
const { getTestFiles } = require("./getTestFiles");
const unpackSynapse = require("./unpackSynapse.js");

describe("unpackSynapse", () => {
  test("splits single synapse link configuration with synapse workspace from solution", () =>
    testUnpackSynapse("single-config-with-synapse"));
  test("splits single synapse link configuration without synapse workspace from solution", () =>
    testUnpackSynapse("single-config-without-synapse"));
  test("splits multiple synpase link configurations from solution", () =>
    testUnpackSynapse("multiple-configs"));
  // TODO: support 0 synapse configs
});

async function testUnpackSynapse(testName) {
  const {
    packedXml,
    unpackedXml,
    unpackedConfigJson,
    unpackedEnvironmentJson,
  } = await getTestFiles(testName);

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
}
