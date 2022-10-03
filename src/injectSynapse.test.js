const { describe, expect, test } = require("@jest/globals");
const { xml2js } = require("xml-js");
const { injectSynapse } = require("./injectSynpase");
const { readTestFiles } = require("./readTestFiles");

describe("injectSynapse", () => {
  test("injects environment information to a packed XML file", async () => {
    // Arrange
    const [preInjectXml, unpackedEnvironmentJson, postInjectXml] =
      await readTestFiles(
        "inject",
        "pre-inject.xml",
        "unpacked-environment.json",
        "post-inject.xml"
      );

    // Act
    const outputXml = injectSynapse({
      packedXml: preInjectXml,
      unpackedEnvironmentJson,
    });

    // Assert
    expect(xml2js(outputXml)).toEqual(xml2js(postInjectXml));
  });
});
