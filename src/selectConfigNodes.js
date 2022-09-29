const { select } = require("xpath");

function selectConfigNodes(dom) {
  return select(
    "/ImportExportXml/msdyn_exporttodatalakeconfigs/msdyn_exporttodatalakeconfig",
    dom
  );
}
exports.selectConfigNodes = selectConfigNodes;
