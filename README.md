# Dataverse Synapse Link Configuration CLI (dsyn-cli)

Provides a work-around for a [current limitation](https://github.com/MicrosoftDocs/powerapps-docs/issues/3503) in deployments of Dataverse Synapse Link configurations.

> :warning: `dsyn-cli` is not supported by the Power Platform product group. No contributor to `dsyn-cli` is responsible for any unexpected behavior in your Dataverse environment(s). Use at your own risk. We recommend taking additional steps to [mitigate risk](#mitigating-risk).

## Table of Contents

- [Problem](#problem)
- [Solution](#solution)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [`unpack`](#unpack)
    - [Examples](#examples)
  - [`pack`](#pack)
    - [Examples](#examples-1)
  - [`inject`](#inject)
    - [Example](#example)
- [Mitigating Risk](#mitigating-risk)

## Problem

In November 2021, [Microsoft announced the deprecation of Data Export Service in favor of Synapse Link for Dataverse](https://powerapps.microsoft.com/en-us/blog/do-more-with-data-from-data-export-service-to-azure-synapse-link-for-dataverse/). At the time of creation of `dsyn-cli`, when trying to set up a healthy ALM ecosystem that includes the deployment of Synapse Link configurations, the target environment of each Synapse Link configuration is hard-coded into the solution file.

As a result of this behavior, when orchestrating automated deployments using solutions, all Dataverse environments will point to the same Azure Data Lake Storage Account (as well as the same Synapse Workspace).

Many customers, including the creators of `dsyn-cli`, would like the option to set up dedicated resources for each of our environments.

## Solution

After using [Power Platform CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction) (or any higher-level wrapper thereof) to unpack a solution, a user or automated service can use `dsyn-cli` to further extract any Synapse Link configuration and environment-level configuration from the unpacked solution into a separate file. Then, an engineer can create additional environment-level configuration for each downstream environment. The resulting folder structure looks something like this:

```
.
????????? solution
|   ????????? Other
|       ????????? Customizations.xml
|       ????????? Solution.xml
????????? synapse.config.json
????????? synapse.development.json
????????? synapse.production.json
```

When it comes time to pack the solution for deployment, `dsyn-cli` can be used to combine `synapse.config.json` and `synapse.production.json`\* back into `Customizations.xml` prior to the calling `pac solution pack`.

(\* Environment-level configuration can be injected directly into a packed zip filer later on; see [inject](#inject).)

## Prerequisites

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

Provides a work-around for a current limitation in deployments of Dataverse Synapse Link configurations.

Options:
  -V, --version     output the version number
  -h, --help        display help for command

Commands:
  unpack [options]  Extracts Synapse Link configuration and environment-level configuration from an unpacked solution folder.
  pack [options]    Inserts Synapse Link configuration and environment-level configuration back into an unpacked solution folder.
  inject [options]  Modifies a packed solution file (`.zip`) by inserting environment-level configuration into the previously packed Synapse Link configuration(s).
  help [command]    display help for command
```

### `unpack`

Extracts Synapse Link configuration and environment-level configuration from an unpacked solution folder.

| Parameter                          | Description                                                                                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-f, --folder <path>`              | **Required.** Path to the folder containing the unpacked solution.                                                                                                                              |
| `-c, --configuration <path>`       | **Required.** Path to the file containing Synapse Link configuration.                                                                                                                           |
| `-e, --environmentSettings <path>` | Path to the file containing environment-level configuration. <br/><br/>If excluded, environment-level configuration will be removed from Synapse Link configuration, but not saved to the disk. |

#### Examples

```powershell
dsyn unpack `
  -f ./solution `
  -c ./synapse.config.json `
  -e ./synapse.development.json
```

```powershell
dsyn unpack `
  -f ./solution `
  -c ./synapse.config.json
```

### pack

Inserts Synapse Link configuration and environment-level configuration back into an unpacked solution folder.

| Parameter                          | Description                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-f, --folder <path>`              | **Required.** Path to the folder containing the unpacked solution.                                                                                                                                                                                                                                            |
| `-c, --configuration <path>`       | **Required.** Path to the file containing Synapse Link configuration.                                                                                                                                                                                                                                         |
| `-e, --environmentSettings <path>` | Path to the file containing environment-level configuration. <br/><br/>If excluded, environment-level configuration will not be added to the `Other/Customizations.xml` file. Prior to importing the solution, you must [`inject`](#inject) environment-level configuration into the packed solution archive. |

#### Examples

```powershell
dsyn pack `
  -f ./solution `
  -c ./synapse.config.json `
  -e ./synapse.production.json
```

```powershell
dsyn pack `
  -f ./solution `
  -c ./synapse.config.json
```

### inject

Modifies a packed solution file (`.zip`) by inserting environment-level configuration into the previously packed Synapse Link configuration(s).

| Parameter                          | Description                                                                |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `-z, --zipFile <path>`             | **Required.** Path to the packed solution archive.                         |
| `-e, --environmentSettings <path>` | **Required.** Path to the file containing environment-level configuration. |

#### Example

```powershell
dsyn inject `
  -z ./solution.zip `
  -e ./synapse.production.json
```

## Mitigating Risk

As `dsyn-cli` is unsupported, we recommend the following practices:

- Isolate your Synapse Link configuration components into a separate solution from your other data elements.
- Only import _managed_ solutions into any of your downstream environments (e.g. test and production).

With these practices in place, if you are experiencing unexpected behavior in a downstream environment as a result of using `dsyn-cli`, you can uninstall the managed solution, which will delete any Synapse Link configurations in that environment. Then, you can _manually_ re-create your Synapse Link configurations in that environment.
