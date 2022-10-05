const { join } = require("path");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const shebang = require("rollup-plugin-preserve-shebang");

module.exports = {
  input: "src/cli.js",
  output: {
    file: "dist/cli.js",
    format: "cjs",
    exports: "auto",
    banner: "#!/usr/bin/env node",
  },
  plugins: [
    shebang(),
    commonjs(),
    replace({
      "process.env.DSYN_CLI_VERSION": `"${
        require(join(__dirname, "package.json")).version
      }"`,
      preventAssignment: true,
    }),
  ],
  external: [
    "commander",
    "fs",
    "fs/promises",
    "os",
    "path",
    "prettier",
    "@prettier/plugin-xml",
    "@xmldom/xmldom",
    "xpath",
    "yauzl",
    "yazl",
  ],
};
