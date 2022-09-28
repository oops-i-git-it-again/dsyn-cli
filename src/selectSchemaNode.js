const { select } = require("xpath");

function selectSchemaNode(configNode) {
  return select("./msdyn_schema", configNode)[0];
}
exports.selectSchemaNode = selectSchemaNode;
