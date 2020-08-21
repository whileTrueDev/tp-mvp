import * as cdk from '@aws-cdk/core';
import * as ssm from '@aws-cdk/aws-ssm';

export default function getSSMParams(scope: cdk.Construct) {
  
  // *****************************************************
  // Production DB configurations
  const TRUEPOINT_DB_HOST = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TRUEPOINT/DB_HOST', {
      parameterName: '/TRUEPOINT/DB_HOST'
    }
  );
  const TRUEPOINT_DB_PASSWORD = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'TRUEPOINT/DB_PASSWORD', {
      parameterName: '/TRUEPOINT/DB_PASSWORD',
      version: 1
    }
  );
  const TRUEPOINT_DB_PORT = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'TRUEPOINT/DB_PORT', {
      parameterName: '/TRUEPOINT/DB_PORT',
      version: 1
    }
  );
  const TRUEPOINT_DB_USER = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TRUEPOINT/DB_USER', {
      parameterName: '/TRUEPOINT/DB_USER'
    }
  );
  const TRUEPOINT_DB_DATABASE = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TRUEPOINT/DB_DATABASE', {
      parameterName: '/TRUEPOINT/DB_DATABASE'
    }
  );
  const TRUEPOINT_DB_CHARSET = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TRUEPOINT/DB_CHARSET', {
      parameterName: '/TRUEPOINT/DB_CHARSET',
    }
  );

  // *****************************************************
  // Development DB configurations
  const DEV_TRUEPOINT_DB_HOST = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TRUEPOINT/DEV/DB_HOST', {
      parameterName: '/TRUEPOINT/DEV/DB_HOST'
    }
  );
  const DEV_TRUEPOINT_DB_PASSWORD = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'TRUEPOINT/DEV/DB_PASSWORD', {
      parameterName: '/TRUEPOINT/DEV/DB_PASSWORD',
      version: 1
    }
  );
  const DEV_TRUEPOINT_DB_PORT = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, 'TRUEPOINT/DEV/DB_PORT', {
      parameterName: '/TRUEPOINT/DEV/DB_PORT',
      version: 1
    }
  );
  const DEV_TRUEPOINT_DB_USER = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TRUEPOINT/DEV/DB_USER', {
      parameterName: '/TRUEPOINT/DEV/DB_USER'
    }
  );
  const DEV_TRUEPOINT_DB_DATABASE = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TRUEPOINT/DEV/DB_DATABASE', {
      parameterName: '/TRUEPOINT/DEV/DB_DATABASE'
    }
  );
  const DEV_TRUEPOINT_DB_CHARSET = ssm.StringParameter.fromStringParameterAttributes(
    scope, 'TRUEPOINT/DEV/DB_CHARSET', {
      parameterName: '/TRUEPOINT/DEV/DB_CHARSET',
    }
  );

  
  // Onad User crypto cipher credentials
  const TRUEPOINT_CIPHER_IV = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, '/TRUEPOINTCIPHER_IV', {
      parameterName: '/TRUEPOINT/CIPHER_IV', version: 1
    }
  );
  const TRUEPOINT_CIPHER_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, '/TRUEPOINTCIPHER_KEY', {
      parameterName: '/TRUEPOINT/CIPHER_KEY', version: 1
    }
  );

  return {
    TRUEPOINT_DB_HOST,
    TRUEPOINT_DB_PASSWORD,
    TRUEPOINT_DB_PORT,
    TRUEPOINT_DB_USER,
    TRUEPOINT_DB_DATABASE,
    TRUEPOINT_DB_CHARSET,
    DEV_TRUEPOINT_DB_HOST,
    DEV_TRUEPOINT_DB_PASSWORD,
    DEV_TRUEPOINT_DB_PORT,
    DEV_TRUEPOINT_DB_USER,
    DEV_TRUEPOINT_DB_DATABASE,
    DEV_TRUEPOINT_DB_CHARSET,
    TRUEPOINT_CIPHER_IV,
    TRUEPOINT_CIPHER_KEY,
  };
}