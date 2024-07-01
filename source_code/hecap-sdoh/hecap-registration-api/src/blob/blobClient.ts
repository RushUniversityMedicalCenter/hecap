const {DataLakeServiceClient,StorageSharedKeyCredential} = require("@azure/storage-file-datalake");
const account = process.env._STORAGE_ACCOUNT_NAME || "";
const accountKey = process.env._STORAGE_AUTHKEY || "";
console.log("=====blobClient:account", account)
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const serviceClient = new DataLakeServiceClient(
  // When using AnonymousCredential, following url should include a valid SAS or support public access
  `https://${account}.dfs.core.windows.net`,
  sharedKeyCredential
);

exports.getFileSystemClient = function(fileSystemName) {
  return serviceClient.getFileSystemClient(fileSystemName)
}