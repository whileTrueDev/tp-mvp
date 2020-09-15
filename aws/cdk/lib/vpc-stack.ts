import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as rds from '@aws-cdk/aws-rds';

// CONSTANTS
const ID_PREFIX               = 'WhileTrue';
const DATABASE_PORT           = 3306;

export class WhileTrueTruepointVpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************
    const vpc = new ec2.Vpc(this, `${ID_PREFIX}Vpc`, {
      cidr: "10.0.0.0/16",
      maxAzs: 10, // To use all Avaliability Zone
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC, // For internet-facing load balancer
          name: 'Ingress',
        },
        {
          subnetType: ec2.SubnetType.PRIVATE, // For applications tier
          name: 'Application',
        },
        {
          subnetType: ec2.SubnetType.ISOLATED, // For Database tier
          name: 'Database',
        },
      ],
      natGateways: 1,
    });
    this.vpc = vpc;
  }
}
