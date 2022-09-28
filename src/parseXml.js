const { DOMParser } = require("@xmldom/xmldom");

function parseXml(customizationsXml) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(customizationsXml);
  return dom;
}
exports.parseXml = parseXml;
