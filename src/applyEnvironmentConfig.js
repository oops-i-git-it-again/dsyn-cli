import { getConfigId } from "./getConfigId.js";
import { selectNameNode } from "./selectNameNode.js";
import { selectSchemaNode } from "./selectSchemaNode.js";

export function applyEnvironmentConfig(
  configNode,
  unpackedEnvironmentJson,
  synapseConfig
) {
  const nameNode = selectNameNode(configNode);
  const configId = getConfigId(configNode);
  const environmentConfig = unpackedEnvironmentJson[configId];
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
  delete synapseConfig.IncludeWorkspace;
  Object.assign(schemaJson, synapseConfig);
  const schemaNode = selectSchemaNode(configNode);
  schemaNode.textContent = JSON.stringify(schemaJson);
}
