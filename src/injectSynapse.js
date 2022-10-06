import { applyEnvironmentConfig } from "./applyEnvironmentConfig.js";
import { parseXml } from "./parseXml.js";
import { selectConfigNodes } from "./selectConfigNodes.js";
import { serializeXml } from "./serializeXml.js";
import { selectSchemaNode } from "./selectSchemaNode.js";

export function injectSynapse({ packedXml, unpackedEnvironmentJson }) {
  const dom = parseXml(packedXml);
  const configNodes = selectConfigNodes(dom);
  configNodes.forEach((configNode) => {
    const schemaNode = selectSchemaNode(configNode);
    const synapseConfig = JSON.parse(schemaNode.textContent);
    applyEnvironmentConfig(configNode, unpackedEnvironmentJson, synapseConfig);
  });
  return serializeXml(dom);
}
