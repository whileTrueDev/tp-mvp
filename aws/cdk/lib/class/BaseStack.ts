import * as cdk from '@aws-cdk/core';
import * as ssm from '@aws-cdk/aws-ssm';

export default class BaseStack extends cdk.Stack {
  /**
   * AWS SSM ParameterStore의 문자열 파라미터에 접근해 해당 파라미터를 반환하는 메서드 (String)
   * @param id 찾고자 하는 파라미터값의 ssm parameter store 키값
   * @param version 해당 파라미터 값의 버전 (대부분 1)
   */
  protected getStringParam(
    prefix: string, id: string, version = 1,
  ): ssm.IStringParameter {
    return ssm.StringParameter.fromStringParameterAttributes(
      this, prefix + id, { parameterName: id, version },
    );
  }

  /**
   * AWS SSM PramaterStore의 보안문자열 파라미터에 접근해 해당 파라미터를 반환하는 메서드 (SecureString)
   * @param id 찾고자 하는 파리미터의 ssm parameter store 키값
   * @param version 해당 파리미터의 버전 (대부분 1)
   */
  protected getSecureParam(
    prefix: string, id: string, version = 1,
  ): ssm.IStringParameter {
    return ssm.StringParameter.fromSecureStringParameterAttributes(
      this, prefix + id, { parameterName: id, version },
    );
  }
}
