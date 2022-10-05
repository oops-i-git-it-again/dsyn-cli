# Dataverse Synapse Link Configuration CLI (dsyn-cli)

This tool provides a work-around for a current limitation in deployments of Dataverse Synapse Link configurations.

## Problem

In November 2021, [Microsoft announced the deprecation of Data Export Service in favor of Synapse Link for Dataverse](https://powerapps.microsoft.com/en-us/blog/do-more-with-data-from-data-export-service-to-azure-synapse-link-for-dataverse/). At the time of creation of this tool, when trying to set up a healthy ALM ecosystem that includes the deployment of Synapse Link configurations, the target environment of each Synapse Link configuration is hard-coded into the solution file.

As a result of this behavior, when orchestrating automated deployments using solutions, all Dataverse environments will point to the same Azure Data Lake Storage Account (as well as the same Synapse Workspace).

Many customers, including the creators of this tool, would like the option to set up dedicated resources for each of our environments.

## Solution

After using [Power Platform CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction) (or any higher-level wrapper thereof) to unpack a solution, a user or automated service can use `dsyn-cli` to further extract any Synapse Link configuration and environment-level configuration from the unpacked solution into a separate file. Then, an engineer can create additional environment-level configuration for each downstream environment. The resulting folder structure looks something like this:

```
|- solution
|--- Other
|----- Customizations.xml
|----- Solution.xml
|- synapse.config.json
|- synapse.development.json
|- synapse.production.json
```

When it comes time to pack the solution for deployment, `dsyn-cli` can be used to combine `synapse.config.json` and `synapse.production.json`\* back into `Customizations.xml` prior to the calling `pac solution pack`.

(\* Environment-level configuration can be injected directly into a packed zip filer later on; see [inject](#inject).)

## Pre-requisites

- [Node.js](https://nodejs.org/en/)

## Installation

Run the following command in a terminal or automated script:

```
npm install -g dsyn-cli
```

To update, run:

```
npm install -g dsyn-cli@latest
```

## Usage

```
> dsyn

Usage: dsyn [options] [command]

Options:
  -h, --help        display help for command

Commands:
  unpack [options]
  pack [options]
  inject [options]
  help [command]    display help for command
```

### `unpack`

Extracts Synapse Link configuration and environment-level configuration from an unpacked solution folder.

| Parameter                          | Description                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-f, --folder <path>`              | **Required.** Path to the folder containing the unpacked solution.                                                                                                                    |
| `-c, --configuration <path>`       | **Required.** Path to the file containing Synapse Link configuration.                                                                                                                 |
| `-e, --environmentSettings <path>` | Path to the file containing environment-level configuration. If excluded, environment-level configuration will be removed from Synapse Link configuration, but not saved to the disk. |

#### Examples

```powershell
dsyn unpack `
  -f ./solution `
  -c ./synapse.config.json `
  -e ./synapse.dev.json
```

```powershell
dsyn unpack `
  -f ./solution `
  -c ./synapse.config.json
```

### pack

### inject