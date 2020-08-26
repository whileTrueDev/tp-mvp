// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code,
// visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK
import AWS from 'aws-sdk';
import { TruepointSecret, TruepointDbSecret } from '../interfaces/Secrets.interface';

const region = 'ap-northeast-2';
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create a Secrets Manager client
const client = new AWS.SecretsManager({ region });

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

async function getDbSecrets(): Promise<TruepointDbSecret> {
  let secret: TruepointDbSecret;
  try {
    const list = await client.listSecrets().promise();
    const target = list.SecretList.find(
      (x) => x.Name.includes(
        process.env.NODE_ENV === 'production'
          ? 'TruepointProductionDB' : 'TruepointDevDB'
      )
    );

    const dbSecretData = await client
      .getSecretValue({ SecretId: target.Name })
      .promise();

    if ('data.SecretBinary' in dbSecretData) {
      // const buff = new Buffer(data.SecretBinary, 'base64');
      // decodedBinarySecret = buff.toString('ascii');
    } else {
      secret = JSON.parse(dbSecretData.SecretString);
    }
  } catch (err) {
    console.log(err);
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
  return secret;
}

// config service
export default async (): Promise<TruepointSecret> => {
  const dbSecrets = await getDbSecrets();
  return {
    database: { ...dbSecrets }
  };
};
