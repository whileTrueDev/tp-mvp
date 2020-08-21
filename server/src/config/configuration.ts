// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code,
// visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK
import AWS from 'aws-sdk';

const region = 'ap-northeast-2';
const secretName = 'TruepointDevDBInstanceSecre-3PRavEbPUj0r';
let secret;
let decodedBinarySecret;

AWS.config.update({
  accessKeyId: 'AKIAYMQWU4UC5GECPYEE',
  secretAccessKey: 'CumsGnDk0qns3GBqu52/AsPoK3PKQt7IHWAwqFNy'
});

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
  region
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

client.getSecretValue({ SecretId: secretName }, (err, data) => {
  if (err) {
    if (err.code === 'DecryptionFailureException') {
      // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    } else if (err.code === 'InternalServiceErrorException') {
      // An error occurred on the server side.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    } else if (err.code === 'InvalidParameterException') {
      // You provided an invalid value for a parameter.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    } else if (err.code === 'InvalidRequestException') {
      // You provided a parameter value that is not valid for the current state of the resource.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    } else if (err.code === 'ResourceNotFoundException') {
      // We can't find the resource that you asked for.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    }
  }
  if (!err) {
    // Decrypts secret using the associated KMS CMK.
    // Depending on whether the secret is a string or binary, one of these fields will be populated.
    if ('data.SecretBinary' in data) {
      // const buff = new Buffer(data.SecretBinary, 'base64');
      // decodedBinarySecret = buff.toString('ascii');
    } else {
      secret = JSON.parse(data.SecretString);
    }
  }

  // Your code goes here.
  console.log(secret);
});
