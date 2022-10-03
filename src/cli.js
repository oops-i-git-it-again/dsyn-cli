#!/usr/bin/env node

const { Command } = require("commander");
const { readFile, writeFile } = require("fs/promises");
const { join } = require("path");
const unpackSynapse = require("./unpackSynapse");
const { format } = require("prettier");
const pluginXml = require("@prettier/plugin-xml");
const { packSynapse } = require("./packSynapse");
const { readFiles } = require("./readFiles");

const program = new Command();
program.name("dsyn");

program
  .command("unpack")
  .requiredOption("-f, --folder <path>")
  .requiredOption("-c, --configuration <path>")
  .option("-e, --environmentSettings <path>")
  .action(async ({ folder, configuration, environmentSettings }) => {
    const customizationsXmlPath = join(folder, "Other", "Customizations.xml");
    const inputXml = (await readFile(customizationsXmlPath)).toString();
    const { unpackedXml, unpackedConfigJson, unpackedEnvironmentJson } =
      unpackSynapse(inputXml);
    const promises = [
      writeFile(customizationsXmlPath, formatXml(unpackedXml)),
      writeFile(
        configuration,
        format(JSON.stringify(unpackedConfigJson), { parser: "json" })
      ),
    ];
    if (environmentSettings) {
      promises.push(
        writeFile(
          environmentSettings,
          format(JSON.stringify(unpackedEnvironmentJson), { parser: "json" })
        )
      );
    }
  });

program
  .command("pack")
  .requiredOption("-f, --folder <path>")
  .requiredOption("-c, --configuration <path>")
  .option("-e, --environmentSettings <path>")
  .action(async ({ folder, configuration, environmentSettings }) => {
    const customizationsXmlPath = join(folder, "Other", "Customizations.xml");
    const [unpackedXml, unpackedConfigJson, unpackedEnvironmentJson] =
      await readFiles(
        customizationsXmlPath,
        configuration,
        environmentSettings
      );
    const packedXml = packSynapse({
      unpackedXml,
      unpackedConfigJson: JSON.parse(unpackedConfigJson),
      unpackedEnvironmentJson:
        unpackedEnvironmentJson && JSON.parse(unpackedEnvironmentJson),
    });
    await writeFile(customizationsXmlPath, formatXml(packedXml));
  });

program.parse();

function formatXml(packedXml) {
  return format(packedXml, {
    parser: "xml",
    plugins: [pluginXml],
    printWidth: Infinity,
  });
}
