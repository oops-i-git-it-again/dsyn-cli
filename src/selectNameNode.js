import { select } from "xpath";

export function selectNameNode(configNode) {
  return select("./msdyn_name", configNode)[0];
}
