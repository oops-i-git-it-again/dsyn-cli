const { expect } = require("@jest/globals");
const { EOL } = require("os");
const { xml2js } = require("xml-js");
const { default: matchers } = require("expect/build/matchers");

expect.extend({
  toMatchCustomizationsXml: (received, expected) =>
    matchers.toEqual(
      parseXml(received, "received"),
      parseXml(expected, "expected")
    ),
});

function parseXml(xml, label) {
  try {
    const xmlJs = xml2js(xml, { compact: true });
    if (!("ImportExportXml" in xmlJs)) {
      throw new Error(
        [
          "Could not find <ImportExportXml /> element in configuration xml",
          `Received: ${xml}`,
        ].join(EOL)
      );
    }
    let configs;
    const rootNode = xmlJs.ImportExportXml;
    if (
      !(
        "msdyn_exporttodatalakeconfigs" in rootNode &&
        "msdyn_exporttodatalakeconfig" in rootNode.msdyn_exporttodatalakeconfigs
      )
    ) {
      configs = {};
    } else {
      const configsSection =
        rootNode.msdyn_exporttodatalakeconfigs.msdyn_exporttodatalakeconfig;
      if (configsSection.__proto__ === Array.prototype) {
        configs = configsSection.reduce(
          (configs, config) => ({
            ...configs,
            [config._attributes.msdyn_exporttodatalakeconfigid]:
              dissectConfig(config),
          }),
          {}
        );
      } else {
        configs = {
          [configsSection._attributes.msdyn_exporttodatalakeconfigid]:
            dissectConfig(configsSection),
        };
      }
    }
    return { configs, xmlJs };
  } catch (error) {
    throw new Error(
      [
        `Could not parse ${label} value as XML.`,
        "Received:",
        xml,
        "Error:",
        error,
      ].join(EOL)
    );
  }
}

function dissectConfig(config, label) {
  const returnObj = { config };
  if ("msdyn_schema" in config && "_text" in config.msdyn_schema) {
    try {
      returnObj.schema = JSON.parse(config.msdyn_schema._text);
    } catch (error) {
      throw new Error(
        [
          `Could not parse schema for config node with id ${config._attributes.msdyn_exporttodatalakeconfigid} in ${label} value.`,
          "Error:",
          error,
        ].join(EOL)
      );
    }
    delete config.msdyn_schema._text;
  }
  return returnObj;
}
