const { XMLSerializer } = require("@xmldom/xmldom");

function serializeXml(dom) {
  const serializer = new XMLSerializer();
  const unpackedXml = serializer.serializeToString(dom);
  return unpackedXml;
}
exports.serializeXml = serializeXml;
