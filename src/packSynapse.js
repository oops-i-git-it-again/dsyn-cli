const { getConfigId } = require("./getConfigId");
const { parseXml } = require("./parseXml");
const { selectConfigNode } = require("./selectConfigNodes");
const { selectNameNode } = require("./selectNameNode");
const { selectSchemaNode } = require("./selectSchemaNode");
const { serializeXml } = require("./serializeXml");

function packSynapse({
  unpackedConfigJson,
  unpackedEnvironmentJson,
  unpackedXml,
}) {
  const dom = parseXml(unpackedXml);
  const configNode = selectConfigNode(dom);
  const configId = getConfigId(configNode);
  const environmentConfig = unpackedEnvironmentJson[configId];
  const synapseConfig = unpackedConfigJson[configId];
  const nameNode = selectNameNode(configNode);
  nameNode.textContent = environmentConfig.StorageAccountName;
  const schemaJson = {};
  schemaJson.SubscriptionId = environmentConfig.SubscriptionId;
  schemaJson.ResourceGroupName = environmentConfig.ResourceGroupName;
  schemaJson.StorageAccountName = environmentConfig.StorageAccountName;
  schemaJson.BlobEndpoint = `https://${environmentConfig.StorageAccountName}.blob.core.windows.net/`;
  schemaJson.QueueEndpoint = `https://${environmentConfig.StorageAccountName}.queue.core.windows.net/`;
  schemaJson.TableEndpoint = `https://${environmentConfig.StorageAccountName}.table.core.windows.net/`;
  schemaJson.FileEndpoint = `https://${environmentConfig.StorageAccountName}.file.core.windows.net/`;
  schemaJson.FileSystemEndpoint = `https://${environmentConfig.StorageAccountName}.dfs.core.windows.net/`;
  if (synapseConfig.IncludeWorkspace) {
    schemaJson.SqlODEndpoint = `${environmentConfig.WorkspaceName}-ondemand.sql.azuresynapse.net`;
    schemaJson.WorkspaceDevEndpoint = `https://${environmentConfig.WorkspaceName}.dev.azuresynapse.net`;
  } else {
    schemaJson.SqlODEndpoint = "";
    schemaJson.WorkspaceDevEndpoint = "";
  }

  Object.assign(schemaJson, synapseConfig);
  delete schemaJson.IncludeWorkspace;
  const schemaNode = selectSchemaNode(configNode);
  schemaNode.textContent = JSON.stringify(schemaJson);
  return serializeXml(dom);
}
exports.packSynapse = packSynapse;
