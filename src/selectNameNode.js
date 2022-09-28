const { select } = require("xpath");

function selectNameNode(configNode) {
  return select("./msdyn_name", configNode)[0];
}
exports.selectNameNode = selectNameNode;
