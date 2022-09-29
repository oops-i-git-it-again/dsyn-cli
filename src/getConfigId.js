function getConfigId(configNode) {
  return configNode.getAttribute("msdyn_exporttodatalakeconfigid");
}
exports.getConfigId = getConfigId;
