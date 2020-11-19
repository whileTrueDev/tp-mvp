import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import { AwsSecretsManagerDBSecrets } from '../interfaces/AwsSecretsManagerDBSecrets.interface';
import { Dict } from '../interfaces/Dict.interface';

export class ConfigService {
  private secrets: Dict<string>;

  private awsSecrets: AwsSecretsManagerDBSecrets;

  private region = 'ap-northeast-2';

  private ssmClient: AWS.SecretsManager;

  constructor() {
    this.config();

    // aws setting
    this.setAwsConfig();
  }

  public config<T extends Dict<string>>(): T {
    try {
      dotenv.config();
    } catch {
      console.error('Error occured during load configurations');
      process.exit(1);
    }

    const { env } = process;
    this.secrets = env;
    return env as T;
  }

  public getValue(key: string): string | undefined {
    if (Object.keys(this.secrets).includes(key)) {
      return this.secrets[key];
    }
    return undefined;
  }

  public getValueFromAws(key: keyof AwsSecretsManagerDBSecrets): string {
    if (Object.keys(this.awsSecrets).includes(key)) {
      return this.awsSecrets[key];
    }
    return undefined;
  }

  private setAwsConfig(): void {
    AWS.config.update({
      accessKeyId: this.getValue('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.getValue('AWS_SECRET_ACCESS_KEY'),
    });
    this.ssmClient = new AWS.SecretsManager({ region: this.region });
  }

  /**
   * aws secrets manager 로부터 DB 설정값을 가져오는 메서드
   */
  public async getDbSecretsFromAws(secretName = 'WhileTrueOutsourcing'): Promise<AwsSecretsManagerDBSecrets> {
    let secret: AwsSecretsManagerDBSecrets;
    try {
      const list = await this.ssmClient.listSecrets().promise();
      const target = list.SecretList?.find(
        (x) => x.Name?.includes(secretName),
      );

      if (target && target.Name) {
        const dbSecretData = await this.ssmClient
          .getSecretValue({ SecretId: target.Name })
          .promise();

        if ('data.SecretBinary' in dbSecretData) {
          // const buff = new Buffer(data.SecretBinary, 'base64');
          // decodedBinarySecret = buff.toString('ascii');
        } else if (dbSecretData && dbSecretData.SecretString) {
          secret = JSON.parse(dbSecretData.SecretString);
          this.awsSecrets = secret;
        }
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

    console.info('Successfully load configurations of AWS RDS !!');
    return secret;
  }
}
