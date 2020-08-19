import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as route53 from '@aws-cdk/aws-route53'
import * as targets from '@aws-cdk/aws-route53-targets'
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as logs from '@aws-cdk/aws-logs';

import getSSMParams from '../utils/getParams';

// CONSTANTS
const DOMAIN_NAME             = 'mytruepoint.com';
const BACKEND_SUBDOMAIN       = 'api';
const ID_PREFIX               = 'Truepoint';
const BACKEND_PORT            = 3000;
const FRONTEND_PORT           = 3001;
const BACKEND_FAMILY_NAME     = 'truepoint-sever';
const FRONTEND_FAMILY_NAME    = 'truepoint-client';
const BACKEND_DOMAIN          = `${BACKEND_SUBDOMAIN}.${DOMAIN_NAME}`;
const FRONTEND_DOMAIN         = DOMAIN_NAME;

const ECS_CLUSTER_NAME        = 'TruepointProduction';

export class TruepointStack extends cdk.Stack {
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
      ]
    });
    
    // *********************************************
    // ************* Security Groups ***************
    // *********************************************

    // Public Load Balancer sec-grp
    const loadBalancerSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}ALBSecGrp`, {
      vpc: vpc,
      securityGroupName: `${ID_PREFIX}PublicALBSecurityGroup`,
      description: 'Allow Inbound traffics for truepoint public ALB.',
      allowAllOutbound: false
    })
    loadBalancerSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow Port 80 for HTTP listener of Public ALB'
    )
    loadBalancerSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow Port 443 for HTTPS listener of Public ALB'
    )
    
    // Backend sec-grp
    const backendSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}BackendSecGrp`, {
      vpc: vpc,
      securityGroupName: `${ID_PREFIX}BackendSecurityGroup`,
      description: 'Allow Inbound traffics for Backend app of Truepoint.',
      allowAllOutbound: true
    })
    backendSecGrp.addIngressRule(
      loadBalancerSecGrp,
      ec2.Port.tcp(BACKEND_PORT),
      `Allow Port ${BACKEND_PORT} for only traffics from the truepoint Public ALB`
    )

    // Frontend sec-grp
    const frontendSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}FrontendSecGrp`, {
      vpc: vpc,
      securityGroupName: `${ID_PREFIX}FrontendSecurityGroup`,
      description: 'Allow Inbound traffics for Frontend app of Truepoint.',
      allowAllOutbound: true
    })
    frontendSecGrp.addIngressRule(
      loadBalancerSecGrp,
      ec2.Port.tcp(FRONTEND_PORT),
      `Allow Port ${FRONTEND_PORT} for only traffics from the truepoint Public ALB`
    )

    // *********************************************
    // *********** SSM Parameter Store *************
    // *********************************************
    const ssmParameters = getSSMParams(this);
    
    // *********************************************
    // ******************* ECS *********************
    // *********************************************

    // Define ECS Cluster
    const productionCluster = new ecs.Cluster(this, `${ID_PREFIX}ProductionCluster`, {
      vpc: vpc, clusterName: ECS_CLUSTER_NAME,
    });

    // *********************************************
    // Define task definition of Backend
    const backendLogGroup = new logs.LogGroup(this, `${ID_PREFIX}BackendLogGroup`, {
      logGroupName: `/ecs/${BACKEND_FAMILY_NAME}`, removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const backendTaskDef = new ecs.FargateTaskDefinition(
      this, `${ID_PREFIX}BackendTaskDef`, { family: BACKEND_FAMILY_NAME }
    );
    const backendContainer = backendTaskDef.addContainer(`${ID_PREFIX}BackendContainer`, {
      image: ecs.ContainerImage.fromRegistry(`hwasurr/${BACKEND_FAMILY_NAME}`),
      memoryLimitMiB: 512,
      secrets: {
        DB_HOST: ecs.Secret.fromSsmParameter(ssmParameters.TRUEPOINT_DB_HOST),
        DB_PASSWORD: ecs.Secret.fromSsmParameter(ssmParameters.TRUEPOINT_DB_PASSWORD),
        DB_PORT: ecs.Secret.fromSsmParameter(ssmParameters.TRUEPOINT_DB_PORT),
        DB_USER: ecs.Secret.fromSsmParameter(ssmParameters.TRUEPOINT_DB_USER),
        DB_DATABASE: ecs.Secret.fromSsmParameter(ssmParameters.TRUEPOINT_DB_DATABASE),
        DB_CHARSET: ecs.Secret.fromSsmParameter(ssmParameters.TRUEPOINT_DB_CHARSET),
      },
      logging: new ecs.AwsLogDriver({ logGroup: backendLogGroup, streamPrefix: 'ecs' }),
    });
    backendContainer.addPortMappings({ containerPort: BACKEND_PORT });

    // *********************************************
    // Define task definition of Frontend
    const frontendLogGroup = new logs.LogGroup(this, `${ID_PREFIX}FrontendLogGroup`, {
      logGroupName: `/ecs/${FRONTEND_FAMILY_NAME}`, removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const frontendTaskDef = new ecs.FargateTaskDefinition(
      this, `${ID_PREFIX}FrontendTaskDef`, { family: FRONTEND_FAMILY_NAME }
    );
    const frontendContainer = frontendTaskDef.addContainer(`${ID_PREFIX}FrontendContainer`, {
      image: ecs.ContainerImage.fromRegistry(`hwasurr/${FRONTEND_FAMILY_NAME}`),
      memoryLimitMiB: 256,
      logging: new ecs.AwsLogDriver({ logGroup: frontendLogGroup, streamPrefix: 'ecs' }),
    });
    frontendContainer.addPortMappings({ containerPort: FRONTEND_PORT });

    // *********************************************
    // Create ECS Service for Backend
    const backendService = new ecs.FargateService(this, `${ID_PREFIX}BackendService`, {
      cluster: productionCluster,
      taskDefinition: backendTaskDef,
      desiredCount: 1,
      serviceName: `${ID_PREFIX}BackendService`
    });
    
    // *********************************************
    // Create ECS Service for Frontend
    const frontendService = new ecs.FargateService(this, `${ID_PREFIX}FrontendService`, {
      cluster: productionCluster,
      taskDefinition: frontendTaskDef,
      desiredCount: 1,
      serviceName: `${ID_PREFIX}FrontendService`
    });


    // *********************************************
    // *********** Certificate manager *************
    // *********************************************
    // const sslcert = acm.Certificate.fromCertificateArn(
    //   this, `${ID_PREFIX}DnsCertificates`,
    //   process.env.AWS_SSL_CERTIFICATIE_ARN // 생성 필요.
    // )

    // *********************************************
    // ******** Application Load Balancer **********
    // *********************************************
    
    // Define loadbalancer Target group
    const backendTargetGroup = new elbv2.ApplicationTargetGroup(this, `${ID_PREFIX}BackendTargetGroup`, {
      vpc: vpc,
      protocol: elbv2.ApplicationProtocol.HTTP,
      port: BACKEND_PORT,
      targets: [backendService],
      targetGroupName: `${ID_PREFIX}BackendTargetGroup`,
      healthCheck: {
        path: '/',
        interval: cdk.Duration.seconds(30),
      }
    });
    const frontendTargetGroup = new elbv2.ApplicationTargetGroup(this, `${ID_PREFIX}FrontendTargetGroup`, {
      vpc: vpc,
      protocol: elbv2.ApplicationProtocol.HTTP,
      port: FRONTEND_PORT,
      targets: [frontendService],
      targetGroupName: `${ID_PREFIX}FrontendTargetGroup`,
      healthCheck: {
        path: '/',
        interval: cdk.Duration.seconds(30),
      }
    });


    // *********************************************
    // ***************** Route53 *******************
    // *********************************************

    
    // *********************************************
    // ******************* RDS *********************
    // *********************************************
    
  }
}
