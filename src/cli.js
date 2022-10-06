#!/usr/bin/env node

import { Command } from "commander";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import unpackSynapse from "./unpackSynapse.js";
import { format } from "prettier";
import pluginXml from "@prettier/plugin-xml";
import { injectSynapse } from "./injectSynapse.js";
import { packSynapse } from "./packSynapse.js";
import { readFiles } from "./readFiles.js";
import { zipMap } from "./zipMap.js";
import { EOL } from "os";

const program = new Command();
program
  .name("dsyn")
  .version(process.env.DSYN_CLI_VERSION ?? "dev")
  .description(
    "Provides a work-around for a current limitation in deployments of Dataverse Synapse Link configurations."
  );

program
  .command("unpack")
  .description(
    "Extracts Synapse Link configuration and environment-level configuration from an unpacked solution folder."
  )
  .requiredOption(
    "-f, --folder <path>",
    "Required. Path to the folder containing the unpacked solution."
  )
  .requiredOption(
    "-c, --configuration <path>",
    "Required. Path to the file containing Synapse Link configuration."
  )
  .option(
    "-e, --environmentSettings <path>",
    [
      "Path to the file containing environment-level configuration.",
      "If excluded, environment-level configuration will be removed from Synapse Link configuration, but not saved to the disk.",
    ].join(EOL)
  )
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
  .description(
    "Inserts Synapse Link configuration and environment-level configuration back into an unpacked solution folder."
  )
  .requiredOption(
    "-f, --folder <path>",
    "Required. Path to the folder containing the unpacked solution."
  )
  .requiredOption(
    "-c, --configuration <path>",
    "Required. Path to the file containing Synapse Link configuration."
  )
  .option(
    "-e, --environmentSettings <path>",
    [
      "Path to the file containing environment-level configuration.",
      "If excluded, environment-level configuration will not be added to the Other/Customizations.xml file. Prior to importing the solution, you must inject environment-level configuration into the packed solution archive.",
    ].join(EOL)
  )
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

program
  .command("inject")
  .description(
    "Modifies a packed solution file (`.zip`) by inserting environment-level configuration into the previously packed Synapse Link configuration(s)."
  )
  .requiredOption(
    "-z, --zipFile <path>",
    "Required. Path to the packed solution archive."
  )
  .requiredOption(
    "-e, --environmentSettings <path>",
    "Required. Path to the file containing environment-level configuration."
  )
  .action(async ({ zipFile, environmentSettings }) => {
    const unpackedEnvironmentJson = JSON.parse(
      (await readFile(environmentSettings)).toString()
    );
    await zipMap(zipFile, "customizations.xml", (packedXml) =>
      injectSynapse({ packedXml, unpackedEnvironmentJson })
    );
  });

program.parse();

function formatXml(packedXml) {
  return format(packedXml, {
    parser: "xml",
    plugins: [pluginXml],
    printWidth: Infinity,
  });
}
