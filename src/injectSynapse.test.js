const { describe, expect, test } = require("@jest/globals");
const { injectSynapse } = require("./injectSynapse");
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
      unpackedEnvironmentJson: JSON.parse(unpackedEnvironmentJson),
    });

    // Assert
    expect(outputXml).toMatchCustomizationsXml(postInjectXml);
  });
});
