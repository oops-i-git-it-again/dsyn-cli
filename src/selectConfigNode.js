const { select } = require("xpath");

function selectConfigNode(dom) {
  return select(
    "/ImportExportXml/msdyn_exporttodatalakeconfigs/msdyn_exporttodatalakeconfig",
    dom
  )[0];
}
exports.selectConfigNode = selectConfigNode;
