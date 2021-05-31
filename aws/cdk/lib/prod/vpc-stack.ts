import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

// CONSTANTS
const ID_PREFIX = 'WhileTrue';
// const DATABASE_PORT = 3306;

export class WhileTrueTruepointVpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************
    const vpc = new ec2.Vpc(this, `${ID_PREFIX}Vpc`, {
      cidr: '10.0.0.0/16',
      maxAzs: 10, // To use all Avaliability Zone
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC, // For internet-facing load balancer
          name: 'Ingress',
        },
        // 비용 절감을 위해 퍼블릭 서브넷만 사용 (mbaku, luke의견 -> TP 보안은 나중에 신경써도 될 듯) 210517
        {
          // 원래는 Private
          subnetType: ec2.SubnetType.PUBLIC, // For applications tier
          name: 'Application',
        },
        {
          // 원래는 Isolated
          subnetType: ec2.SubnetType.PUBLIC, // For Database tier
          name: 'Database',
        },
      ],
      // natGateways: 1,
    });
    this.vpc = vpc;
  }
}
