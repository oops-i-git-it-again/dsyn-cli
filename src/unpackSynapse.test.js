import { describe, expect, test } from "@jest/globals";
import { getTestFiles } from "./getTestFiles.js";
import unpackSynapse from "./unpackSynapse.js";

describe("unpackSynapse", () => {
  test("splits single synapse link configuration with synapse workspace from solution", () =>
    testUnpackSynapse("single-config-with-synapse"));
  test("splits single synapse link configuration without synapse workspace from solution", () =>
    testUnpackSynapse("single-config-without-synapse"));
  test("splits multiple synpase link configurations from solution", () =>
    testUnpackSynapse("multiple-configs"));
  test("outputs empty JSON objects when no link configurations are found", () =>
    testUnpackSynapse("zero-configs"));
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
  expect(output.unpackedXml).toMatchCustomizationsXml(unpackedXml);
  expect(output).toHaveProperty("unpackedConfigJson");
  expect(output.unpackedConfigJson).toEqual(JSON.parse(unpackedConfigJson));
  expect(output).toHaveProperty("unpackedEnvironmentJson");
  expect(output.unpackedEnvironmentJson).toEqual(
    JSON.parse(unpackedEnvironmentJson)
  );
}
