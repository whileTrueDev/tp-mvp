// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code,
// visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK
const AWS = require('aws-sdk');
const region = 'ap-northeast-2';
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create a Secrets Manager client
const client = new AWS.SecretsManager({ region });

async function getDbSecrets() {
  let secret = {};
  try {
    const list = await client.listSecrets().promise();
    const target = list.SecretList.find(
      (x) => x.Name.includes('WhileTrueCollector')
    );
    const dbSecretData = await client.getSecretValue({ SecretId: target.Name }).promise();
    secret = JSON.parse(dbSecretData.SecretString);
  }
  catch (err) {
    console.log(err);
  }
  return secret;
}

const dbConfig = async () => {
  const dbSecrets = await getDbSecrets();
  return  { ...dbSecrets };
};

module.exports = dbConfig;