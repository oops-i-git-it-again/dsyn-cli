import { getConfigId } from "./getConfigId.js";
import { parseXml } from "./parseXml.js";
import { selectConfigNodes } from "./selectConfigNodes.js";
import { selectNameNode } from "./selectNameNode.js";
import { selectSchemaNode } from "./selectSchemaNode.js";
import { serializeXml } from "./serializeXml.js";

export default (function unpackSynapse(customizationsXml) {
  const dom = parseXml(customizationsXml);
  const configNodes = selectConfigNodes(dom);
  const unpackedConfigJson = {};
  const unpackedEnvironmentJson = {};

  configNodes.forEach((configNode) => {
    const configId = getConfigId(configNode);

    const nameNode = selectNameNode(configNode);
    nameNode.removeChild(nameNode.firstChild);

    const jsonNode = selectSchemaNode(configNode);
    const synapseConfig = Object.assign(
      { IncludeWorkspace: null },
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

    const environmentConfig = {
      ResourceGroupName: resourceGroupName,
      SubscriptionId: subscriptionId,
      StorageAccountName: storageAccountName,
    };

    if (synapseConfig.WorkspaceDevEndpoint === "") {
      synapseConfig.IncludeWorkspace = false;
    } else {
      synapseConfig.IncludeWorkspace = true;
      environmentConfig.WorkspaceName = new URL(
        synapseConfig.WorkspaceDevEndpoint
      ).hostname.split(".")[0];
    }
    delete synapseConfig.WorkspaceDevEndpoint;

    unpackedConfigJson[configId] = synapseConfig;
    unpackedEnvironmentJson[configId] = environmentConfig;
  });

  return {
    unpackedXml: serializeXml(dom),
    unpackedConfigJson,
    unpackedEnvironmentJson,
  };
});
