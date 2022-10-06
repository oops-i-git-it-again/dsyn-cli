const { applyEnvironmentConfig } = require("./applyEnvironmentConfig");
const { parseXml } = require("./parseXml");
const { selectConfigNodes } = require("./selectConfigNodes");
const { serializeXml } = require("./serializeXml");
const { selectSchemaNode } = require("./selectSchemaNode");

function injectSynapse({ packedXml, unpackedEnvironmentJson }) {
  const dom = parseXml(packedXml);
  const configNodes = selectConfigNodes(dom);
  configNodes.forEach((configNode) => {
    const schemaNode = selectSchemaNode(configNode);
    const synapseConfig = JSON.parse(schemaNode.textContent);
    applyEnvironmentConfig(configNode, unpackedEnvironmentJson, synapseConfig);
  });
  return serializeXml(dom);
}
exports.injectSynapse = injectSynapse;
