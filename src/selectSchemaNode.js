import { select } from "xpath";

export function selectSchemaNode(configNode) {
  return select("./msdyn_schema", configNode)[0];
}
