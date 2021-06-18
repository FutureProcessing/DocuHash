$parameters = (Get-Content parameters.json | ConvertFrom-Json).parameters
$applicationImageName = "$($parameters.container_registry_name.value).azurecr.io/$($parameters.client_app_repo_name.value)"
$ipfsImageName = "$($parameters.container_registry_name.value).azurecr.io/$($parameters.ipfs_app_repo_name.value)"

# Create a new resource group
az group create --location $parameters.location.value --name $parameters.resource_group_name.value

# Deploy infrastructure
az deployment group create --resource-group $parameters.resource_group_name.value --template-file .\infrastructureTemplate.json --parameters .\parameters.json

# Build and push images
docker build -t $applicationImageName --no-cache ..\
docker build -t $ipfsImageName --no-cache ..\ipfs

az acr login -n $parameters.container_registry_name.value

docker push $applicationImageName
docker push $ipfsImageName

# Deploy applications
az deployment group create --resource-group $parameters.resource_group_name.value --template-file .\applicationsTemplate.json --parameters .\parameters.json

# Restart all applications so that the containers use proper ports (from appsettings)
az webapp stop --name $parameters.client_app_name.value --resource-group $parameters.resource_group_name.value
az webapp stop --name $parameters.ipfs_app_name.value --resource-group $parameters.resource_group_name.value
az webapp stop --name $parameters.eth_app_name.value --resource-group $parameters.resource_group_name.value

az webapp start --name $parameters.eth_app_name.value --resource-group $parameters.resource_group_name.value
az webapp start --name $parameters.ipfs_app_name.value --resource-group $parameters.resource_group_name.value
az webapp start --name $parameters.client_app_name.value --resource-group $parameters.resource_group_name.value
