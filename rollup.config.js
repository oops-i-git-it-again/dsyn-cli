import { join } from "path";
import replace from "@rollup/plugin-replace";
import shebang from "rollup-plugin-preserve-shebang";

/** @type {import("rollup").RollupOptions} */
const config = {
  input: "src/cli.js",
  output: {
    file: "dist/cli.js",
    format: "esm",
    exports: "auto",
  },
  plugins: [
    shebang(),
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
export default config;
