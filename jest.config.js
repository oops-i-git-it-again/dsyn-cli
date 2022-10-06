/** @type {import("jest").Config} */
const config = {
  watchPathIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["./src/toMatchCustomizationsXml.js"],
  transform: {},
};
export default config;
