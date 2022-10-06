import { XMLSerializer } from "@xmldom/xmldom";

export function serializeXml(dom) {
  const serializer = new XMLSerializer();
  const unpackedXml = serializer.serializeToString(dom);
  return unpackedXml;
}
