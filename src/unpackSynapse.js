const { parseXml } = require("./parseXml");
const { selectConfigNode } = require("./selectConfigNode");
const { selectNameNode } = require("./selectNameNode");
const { selectSchemaNode } = require("./selectSchemaNode");
const { serializeXml } = require("./serializeXml");

module.exports = function unpackSynapse(customizationsXml) {
  const dom = parseXml(customizationsXml);
  const configNode = selectConfigNode(dom);
  const nameNode = selectNameNode(configNode);
  nameNode.removeChild(nameNode.firstChild);
  const jsonNode = selectSchemaNode(configNode);
  const synapseConfig = Object.assign(
    { IncludeWorkspace: true },
    JSON.parse(jsonNode.textContent)
  );
  jsonNode.removeChild(jsonNode.firstChild);
  const subscriptionId = synapseConfig.SubscriptionId;
  delete synapseConfig.SubscriptionId;
  const resourceGroupName = synapseConfig.ResourceGroupName;
  delete synapseConfig.ResourceGroupName;
  const storageAccountName = synapseConfig.StorageAccountName;
  delete synapseConfig.StorageAccountName;
  delete synapseConfig.BlobEndpoint;
  delete synapseConfig.QueueEndpoint;
  delete synapseConfig.TableEndpoint;
  delete synapseConfig.FileEndpoint;
  delete synapseConfig.FileSystemEndpoint;
  delete synapseConfig.SqlODEndpoint;
  const workspaceName = new URL(
    synapseConfig.WorkspaceDevEndpoint
  ).hostname.split(".")[0];
  delete synapseConfig.WorkspaceDevEndpoint;
  const unpackedXml = serializeXml(dom);
  return {
    unpackedXml,
    unpackedConfigJson: synapseConfig,
    unpackedEnvironmentJson: {
      WorkspaceName: workspaceName,
      ResourceGroupName: resourceGroupName,
      SubscriptionId: subscriptionId,
      StorageAccountName: storageAccountName,
    },
  };
};
