import { select } from "xpath";

export function selectConfigNodes(dom) {
  return select(
    "/ImportExportXml/msdyn_exporttodatalakeconfigs/msdyn_exporttodatalakeconfig",
    dom
  );
}
