const { parseXml } = require("./parseXml");
const { selectConfigNode } = require("./selectConfigNode");
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
  const nameNode = selectNameNode(configNode);
  nameNode.textContent = unpackedEnvironmentJson.StorageAccountName;
  const schemaJson = {};
  schemaJson.SubscriptionId = unpackedEnvironmentJson.SubscriptionId;
  schemaJson.ResourceGroupName = unpackedEnvironmentJson.ResourceGroupName;
  schemaJson.StorageAccountName = unpackedEnvironmentJson.StorageAccountName;
  schemaJson.BlobEndpoint = `https://${unpackedEnvironmentJson.StorageAccountName}.blob.core.windows.net/`;
  schemaJson.QueueEndpoint = `https://${unpackedEnvironmentJson.StorageAccountName}.queue.core.windows.net/`;
  schemaJson.TableEndpoint = `https://${unpackedEnvironmentJson.StorageAccountName}.table.core.windows.net/`;
  schemaJson.FileEndpoint = `https://${unpackedEnvironmentJson.StorageAccountName}.file.core.windows.net/`;
  schemaJson.FileSystemEndpoint = `https://${unpackedEnvironmentJson.StorageAccountName}.dfs.core.windows.net/`;
  schemaJson.SqlODEndpoint = `${unpackedEnvironmentJson.WorkspaceName}-ondemand.sql.azuresynapse.net`;
  schemaJson.WorkspaceDevEndpoint = `https://${unpackedEnvironmentJson.WorkspaceName}.dev.azuresynapse.net`;
  Object.assign(schemaJson, unpackedConfigJson);
  const schemaNode = selectSchemaNode(configNode);
  schemaNode.textContent = JSON.stringify(schemaJson);
  return serializeXml(dom);
}
exports.packSynapse = packSynapse;
