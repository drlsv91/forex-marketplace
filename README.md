# Forex Marketplace

✨ Welcome to the **Forex Marketplace** monorepo! ✨

This project is a microservices-based Forex marketplace built using **NestJS**, **TypeORM**, **Postgres**, and **Nx**. It allows users to buy and sell forex, with conversion rates fetched from an external API.

## Project Overview

The Forex Marketplace is a monorepo project composed of multiple microservices:

1. **Wallet Service**: Manages user wallets and transactions.
2. **Order Service**: Handles forex transactions and orders.
3. **User Auth Service**: Manages user registration, authentication, and profiles.
4. **Rate Service**: Fetches forex rates from an external API and exposes them via gRPC.
5. **Notification Service**: Sends notifications to users after successful transactions.

## Project setup

To set up the project, first install pnpm (if not already installed):

```bash
$ npm install -g pnpm
```

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve <service-name>
```

To create a production bundle:

```sh
npx nx build <service-name>
```

To see all available targets to run for a project, run:

```sh
npx nx show project <service-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/nest:app <service-name>
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib <library-name>
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Testing

Run unit tests for all services:

```sh
pnpm nx run-many --target=test --all
```

## Running Services Locally

To start all services locally, use the following command:

```sh
pnpm run start
```

## Deploying Services with Docker

To deploy and run the entire system using Docker, make sure all environment variables for each service are properly configured (refer to the respective README.md files for details). Then, execute the following command:

```sh
docker-compose up --build
```

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## ERD Documentation

The database schema for the Forex Marketplace is documented using [dbdiagrams.io](https://dbdiagram.io/). Below is the ERD for the system: [forex_marketplace](https://dbdocs.io/o.oluwaleye93/forex-marketplace)

## License

This project is licensed under the MIT License.
