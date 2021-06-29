# DocuHash

Simple PoC that shows you how to use IPFS and Ethereum blockchain to store files and their information.

You can check out the live application :point_right: [here](https://docuhash.azurewebsites.net/) :point_left:.

## Description

This sample project was prepared as a response to the need of durable medium required by some Polish acts. It helps in persistent storage of files in distributed file system with information saved in immutable and distributed ledger.

## Quick start

The application can be run either through Docker or by running all of the necessary services manually.

### Start with Docker

In order to run the application, please follow the steps:

1. Ensure that you have [Docker](https://docs.docker.com/get-docker/) installed and that `docker compose` is available in the command line.
2. Clone the repository and navigate to the root directory.
3. Run `docker compose up` in a console window. This may take a while. Once you see the text:

    ```
    application_1  | Compiled successfully!
    application_1  |
    application_1  | You can now view docuhash in the browser.
    application_1  |
    application_1  |   Local:            http://localhost:3000
    application_1  |   On Your Network:  http://172.22.0.4:3000
    application_1  |
    application_1  | Note that the development build is not optimized.
    application_1  | To create a production build, use yarn build.
    ```

    you should be able to open the application in the browser by navigating to `localhost:3000`. Keep the console window open.

### Start without Docker

In order to run the application, please follow the steps:

1. Install the following tools and ensure that they are available from the command line:
    1. [Node.js](https://nodejs.org/en/download/) (latest LTS version is recommended),
    2. [Truffle](https://www.npmjs.com/package/truffle) (version 5.\*),
    3. [IPFS Desktop](http://docs.ipfs.io.ipns.localhost:8080/install/ipfs-desktop/).
2. Clone the repository and navigate to the `eth` directory.
3. In the console run `truffle develop`.
4. In the interactive Truffle console, run `compile`, followed by `migrate --reset`. Keep the console window open.
5. In a new console window, navigate to the directory containing the IPFS executable.
6. Run in sequence:
    ```
    > ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'
    > ipfs bootstram rm --all
    > ipfs daemon
    ```
    Keep the console window open.
7. In a new console window, navigate to the root directory.
8. Run `yarn` followed by `yarn start`. Keep the console window open. A new browser window/tab should automatically open and the application should shortly load within it.

## Deployment

DocuHash has been deployed to the MS Azure cloud. The following steps can be followed in order to deploy another instance of the PoC:

1. Clone the repository.
2. Install [Azure CLI](https://docs.microsoft.com/pl-pl/cli/azure/install-azure-cli) and [Docker](https://docs.docker.com/get-docker/). Ensure that az and docker commands are available from the command line.

    ```
    > az -v
    azure-cli 2.25.0

    > docker -v
    Docker version 20.10.6, build 370c289
    ```

3. Open PowerShell terminal.
4. Log in to your Azure account by running `az login`. Optionally set a subscription you want the application to be deployed to by running `az account set -s <name or id of the subscription>`.
5. Modify values inside deploy/parameters.json file, in parameters section:
    - `location` - location to which services will be deployed. You can view the full list of available locations by running `az account list-locations -o table`.
    - `resource_group_name` - name of the resource group to which services will be deployed. Needs to be unique in scope of the subscription.
    - `service_plan_name` - name of the app service plan on which the applications will run. Needs to be unique in scope of the resource group.
    - `container_registry_name` - name of the container registry used for storing Docker images. Needs to be globally unique.
    - `client_app_repo_name` - name of the repository/image of the client application. Needs to be unique in scope of the container registry.
    - `ipfs_app_repo_name` - name of the repository/image of the IPFS application. Needs to be unique in scope of the container registry.
    - `client_app_name` - name of the client application. Needs to be globally unique.
    - `ipfs_app_name` - name of the IPFS application. Needs to be globally unique.
    - `eth_app_name` - name of the ETH application. Needs to be globally unique.
6. Modify the `dockerEntrypoint.sh` file located in the repo's root directory. In the third line, change `--network demo` to `--network production`.
7. Navigate to the `deploy` directory and run `.\deploy.ps1`. Deployment may take up to several minutes, depending on your Internet connection speed and the processing power of your machine.
8. Once deployment is finished, navigate in your browser to `https://<client_app_name>.azurewebsites.net`. Wait for a few minutes and refresh the page once in a while while waiting for the containers to spin up. Do not worry about potential errors initially showing in the browser window. Eventually the application should appear in the browser. If the application doesn't start after several minutes, consider checking logs for each of the app services created during deployment in order to pinpoint the issue.

## Instructions

The first version of this PoC was fully described in [this article](https://www.future-processing.pl/blog/storing-files-in-a-distributed-file-system-using-blockchain-technology/). You may refer to it for more verbose description of the project, though some technical aspects may have become obsolete.

## License

This Proof of Concept is licensed under MIT License, we will be more than happy if you consider it as valuable. Feel free to contact us at blockchain@future-processing.com
