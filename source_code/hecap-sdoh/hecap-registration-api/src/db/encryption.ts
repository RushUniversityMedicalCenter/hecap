const cryptoObj = require('crypto');
const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

// Azure Key Vault configuration
const keyVaultName = process.env.KEY_VAULT_NAME_HECAP;
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net/`;
const keyName = process.env.KEY_NAME_SQL_ENCRYPT_HECAP;

// Configure the Azure Key Vault client
const credential = new DefaultAzureCredential();
const keyVaultClient = new SecretClient(keyVaultUrl, credential);
var sqlEncryptKey = null

// Function to retrieve the encryption key from Azure Key Vault
async function getEncryptionKey(context) {
  if (sqlEncryptKey) {
    return sqlEncryptKey
  } else {
    try {
      const secret = await keyVaultClient.getSecret(keyName);
      sqlEncryptKey = secret.value
      return secret.value;
    } catch(err) {
      sqlEncryptKey = null
      context.log("===SQL pool connection failed!", err)
    } 
  }
}

function encryptData(data, key) {
    const cipher = cryptoObj.createCipher('aes-256-ecb', key);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
  
    return encryptedData;
  }
  
function decryptData(encryptedData, key) {
  const decipher = cryptoObj.createDecipher('aes-256-ecb', key);
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}

module.exports = {getEncryptionKey, encryptData, decryptData}