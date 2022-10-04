const { applyEnvironmentConfig } = require("./applyEnvironmentConfig");
const { parseXml } = require("./parseXml");
const { selectConfigNodes } = require("./selectConfigNodes");
const { selectSchemaNode } = require("./selectSchemaNode");
const { serializeXml } = require("./serializeXml");

function injectSynapse({ packedXml, unpackedEnvironmentJson }) {
  const dom = parseXml(packedXml);
  const configNodes = selectConfigNodes(dom);
  configNodes.forEach((configNode) => {
    const schemaJson = applyEnvironmentConfig(
      configNode,
      unpackedEnvironmentJson
    );
    const schemaNode = selectSchemaNode(configNode);
    const configJson = JSON.parse(schemaNode.textContent);
    Object.assign(schemaJson, configJson);
    schemaNode.textContent = JSON.stringify(schemaJson);
  });
  return serializeXml(dom);
}
exports.injectSynapse = injectSynapse;
