const { applyEnvironmentConfig } = require("./applyEnvironmentConfig");
const { getConfigId } = require("./getConfigId");
const { parseXml } = require("./parseXml");
const { selectConfigNodes } = require("./selectConfigNodes");
const { selectSchemaNode } = require("./selectSchemaNode");
const { serializeXml } = require("./serializeXml");

function packSynapse({
  unpackedConfigJson,
  unpackedEnvironmentJson,
  unpackedXml,
}) {
  const dom = parseXml(unpackedXml);
  const configNodes = selectConfigNodes(dom);
  configNodes.forEach((configNode) => {
    const configId = getConfigId(configNode);
    const synapseConfig = unpackedConfigJson[configId];
    const schemaJson = unpackedEnvironmentJson
      ? applyEnvironmentConfig(configNode, unpackedEnvironmentJson)
      : {};

    Object.assign(schemaJson, synapseConfig);
    delete schemaJson.IncludeWorkspace;
    const schemaNode = selectSchemaNode(configNode);
    schemaNode.textContent = JSON.stringify(schemaJson);
  });
  return serializeXml(dom);
}
exports.packSynapse = packSynapse;
