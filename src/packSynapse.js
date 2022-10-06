import { applyEnvironmentConfig } from "./applyEnvironmentConfig.js";
import { getConfigId } from "./getConfigId.js";
import { parseXml } from "./parseXml.js";
import { selectConfigNodes } from "./selectConfigNodes.js";
import { selectSchemaNode } from "./selectSchemaNode.js";
import { serializeXml } from "./serializeXml.js";

export function packSynapse({
  unpackedConfigJson,
  unpackedEnvironmentJson,
  unpackedXml,
}) {
  const dom = parseXml(unpackedXml);
  const configNodes = selectConfigNodes(dom);
  configNodes.forEach((configNode) => {
    const configId = getConfigId(configNode);
    const synapseConfig = unpackedConfigJson[configId];
    if (unpackedEnvironmentJson) {
      applyEnvironmentConfig(
        configNode,
        unpackedEnvironmentJson,
        synapseConfig
      );
    } else {
      const schemaNode = selectSchemaNode(configNode);
      schemaNode.textContent = JSON.stringify(synapseConfig);
    }
  });
  return serializeXml(dom);
}
