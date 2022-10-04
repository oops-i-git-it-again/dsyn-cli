const { getConfigId } = require("./getConfigId");
const { parseXml } = require("./parseXml");
const { selectConfigNodes } = require("./selectConfigNodes");
const { selectNameNode } = require("./selectNameNode");
const { selectSchemaNode } = require("./selectSchemaNode");
const { serializeXml } = require("./serializeXml");

function packSynapse({
  unpackedConfigJson,
  unpackedEnvironmentJson,
  unpackedXml,
}) {
  if (!unpackedEnvironmentJson) {
    return `<?xml version="1.0" encoding="utf-8"?>
    <ImportExportXml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <Entities />
      <Roles />
      <Workflows />
      <FieldSecurityProfiles />
      <Templates />
      <EntityMaps />
      <EntityRelationships />
      <OrganizationSettings />
      <optionsets />
      <CustomControls />
      <EntityDataProviders />
      <msdyn_exporttodatalakeconfigs>
        <msdyn_exporttodatalakeconfig msdyn_exporttodatalakeconfigid="653ae937-c02f-ed11-9db1-0022482dfdbf">
          <iscustomizable>1</iscustomizable>
          <msdyn_name>soracodlsadev</msdyn_name>
          <msdyn_schema>{"SubscriptionId":"46a1f76e-5374-4209-8b13-e83da64d2e5d","ResourceGroupName":"SynapseDev","StorageAccountName":"soracodlsadev","BlobEndpoint":"https://soracodlsadev.blob.core.windows.net/","QueueEndpoint":"https://soracodlsadev.queue.core.windows.net/","TableEndpoint":"https://soracodlsadev.table.core.windows.net/","FileEndpoint":"https://soracodlsadev.file.core.windows.net/","FileSystemEndpoint":"https://soracodlsadev.dfs.core.windows.net/","SqlODEndpoint":"soracosyndev-ondemand.sql.azuresynapse.net","WorkspaceDevEndpoint":"https://soracosyndev.dev.azuresynapse.net","Entities":[{"Type":"account","PartitionStrategy":"Month","RecordCountPerBlock":125,"AppendOnlyMode":false},{"Type":"category","PartitionStrategy":"Month","RecordCountPerBlock":125,"AppendOnlyMode":false},{"Type":"contact","PartitionStrategy":"Month","RecordCountPerBlock":125,"AppendOnlyMode":false}],"RetryPolicy":{"MaxRetryCount":12,"IntervalInSeconds":5},"DestinationType":"Adls","WriteDeleteLog":true,"IsOdiEnabled":false,"SchedulerIntervalInMinutes":60}</msdyn_schema>
          <statecode>0</statecode>
          <statuscode>1</statuscode>
        </msdyn_exporttodatalakeconfig>
        <msdyn_exporttodatalakeconfig msdyn_exporttodatalakeconfigid="9368f9e9-753f-ed11-9db0-000d3a8be5ea">
          <iscustomizable>1</iscustomizable>
          <msdyn_name>soracodlsadev2</msdyn_name>
          <msdyn_schema>{"SubscriptionId":"46a1f76e-5374-4209-8b13-e83da64d2e5d","ResourceGroupName":"SynapseDev","StorageAccountName":"soracodlsadev2","BlobEndpoint":"https://soracodlsadev2.blob.core.windows.net/","QueueEndpoint":"https://soracodlsadev2.queue.core.windows.net/","TableEndpoint":"https://soracodlsadev2.table.core.windows.net/","FileEndpoint":"https://soracodlsadev2.file.core.windows.net/","FileSystemEndpoint":"https://soracodlsadev2.dfs.core.windows.net/","SqlODEndpoint":"","WorkspaceDevEndpoint":"","Entities":[{"Type":"account","PartitionStrategy":"Month","RecordCountPerBlock":125,"AppendOnlyMode":false}],"RetryPolicy":{"MaxRetryCount":12,"IntervalInSeconds":5},"DestinationType":"Adls","WriteDeleteLog":true,"IsOdiEnabled":false,"SchedulerIntervalInMinutes":60}</msdyn_schema>
          <statecode>0</statecode>
          <statuscode>1</statuscode>
        </msdyn_exporttodatalakeconfig>
      </msdyn_exporttodatalakeconfigs>
      <Languages>
        <Language>1033</Language>
      </Languages>
    </ImportExportXml>`;
  }
  const dom = parseXml(unpackedXml);
  const configNodes = selectConfigNodes(dom);
  configNodes.forEach((configNode) => {
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
  });
  return serializeXml(dom);
}
exports.packSynapse = packSynapse;
