const commonjs = require("@rollup/plugin-commonjs");
const shebang = require("rollup-plugin-preserve-shebang");

module.exports = {
  input: "src/cli.js",
  output: {
    file: "dist/cli.js",
    format: "cjs",
    exports: "auto",
    banner: "#!/usr/bin/env node",
  },
  plugins: [shebang(), commonjs()],
  external: [
    "commander",
    "fs/promises",
    "path",
    "prettier",
    "@prettier/plugin-xml",
    "@xmldom/xmldom",
    "xpath",
  ],
};
