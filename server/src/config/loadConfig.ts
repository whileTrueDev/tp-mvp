// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code,
// visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK
import AWS from 'aws-sdk';
import { TruepointDbSecret, DbSecret, CollectorDbSecret } from '../interfaces/Secrets.interface';

export const AWS_REGION = 'ap-northeast-2';
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Create a Secrets Manager client
const client = new AWS.SecretsManager({ region: AWS_REGION });

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

/**
 * Truepoint 앱 DB Secret 정보를 가져오는 함수.
 */
async function getDbSecrets(secretsName: string): Promise<DbSecret> {
  let secret: DbSecret;
  try {
    const list = await client.listSecrets().promise();
    const target = list.SecretList.find(
      (x) => x.Name.includes(secretsName),
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
    console.error(err);
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
export default async (): Promise<TruepointDbSecret | CollectorDbSecret> => {
  const truepointDbName = process.env.NODE_ENV === 'production'
    ? 'TruepointProductionDB' // production 환경( 정확히는, production RDS DB) 이 준비되었을 때.
    : 'TruepointDevDB';

  // Truepoint App DB Secrets
  const dbSecrets = await getDbSecrets(truepointDbName);

  // Collector DB Secrets
  const collectorDbName = 'WhileTrueCollectorDB';
  const collectorDbSecerts = await getDbSecrets(collectorDbName);

  return {
    database: { ...dbSecrets },
    WhileTrueCollectorDB: { ...collectorDbSecerts },
  };
};
