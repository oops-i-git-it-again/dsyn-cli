import { DOMParser } from "@xmldom/xmldom";

export function parseXml(customizationsXml) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(customizationsXml);
  return dom;
}
