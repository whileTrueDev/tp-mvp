import * as cdk from '@aws-cdk/core';
import * as ssm from '@aws-cdk/aws-ssm';

export default function getSSMParams(scope: cdk.Construct) {
  
  // ********************************************************************
  // 삭제 필요. 데이터베이스 secrets은 aws-sdk를 이용한다.

  // Onad User crypto cipher credentials
  // const TRUEPOINT_CIPHER_IV = ssm.StringParameter.fromSecureStringParameterAttributes(
  //   scope, '/TRUEPOINTCIPHER_IV', {
  //     parameterName: '/TRUEPOINT/CIPHER_IV', version: 1
  //   }
  // );
  // const TRUEPOINT_CIPHER_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
  //   scope, '/TRUEPOINTCIPHER_KEY', {
  //     parameterName: '/TRUEPOINT/CIPHER_KEY', version: 1
  //   }
  // );

  // ********************************************************************
  // Truepoint Access key id
  const TRUEPOINT_ACCESS_KEY_ID = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, '/TRUEPOINT_ACCESS_KEY_ID', {
      parameterName: '/TRUEPOINT_ACCESS_KEY_ID', version: 1
    }
  );
  // Truepoint secret Access key
  const TRUEPOINT_SECRET_ACCESS_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, '/TRUEPOINT_SECRET_ACCESS_KEY', {
      parameterName: '/TRUEPOINT_SECRET_ACCESS_KEY', version: 1
    }
  );

  // ********************************************************************
  // Twitch Api key set
  const CRAWL_TWITCH_API_KEY = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, '/CRAWL_TWITCH_API_KEY', {
      parameterName: '/CRAWL_TWITCH_API_KEY', version: 1
    }
  )
  const CRAWL_TWITCH_API_CLIENT_SECRET = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, '/CRAWL_TWITCH_API_CLIENT_SECRET', {
      parameterName: '/CRAWL_TWITCH_API_CLIENT_SECRET', version: 1
    }
  )
  const TWITCH_BOT_OAUTH_TOKEN = ssm.StringParameter.fromSecureStringParameterAttributes(
    scope, '/TWITCH_BOT_OAUTH_TOKEN', {
      parameterName: '/TWITCH_BOT_OAUTH_TOKEN', version: 1
    }
  )


  return {
    TRUEPOINT_ACCESS_KEY_ID,
    TRUEPOINT_SECRET_ACCESS_KEY,
    CRAWL_TWITCH_API_KEY,
    CRAWL_TWITCH_API_CLIENT_SECRET,
    TWITCH_BOT_OAUTH_TOKEN,
  };
}