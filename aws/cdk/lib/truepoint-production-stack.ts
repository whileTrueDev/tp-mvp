import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as route53 from '@aws-cdk/aws-route53'
import * as route53targets from '@aws-cdk/aws-route53-targets'
import * as logs from '@aws-cdk/aws-logs';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as rds from '@aws-cdk/aws-rds';

import getSSMParams from '../utils/getParams';

// CONSTANTS
const DOMAIN_NAME             = 'mytruepoint.com';
const BACKEND_SUBDOMAIN       = 'api';
const ID_PREFIX               = 'Truepoint';
const DATABASE_PORT           = 3306;
const BACKEND_PORT            = 3000;
const FRONTEND_PORT           = 3001;
const BACKEND_FAMILY_NAME     = 'truepoint-sever';
const FRONTEND_FAMILY_NAME    = 'truepoint-client';
const BACKEND_DOMAIN          = `${BACKEND_SUBDOMAIN}.${DOMAIN_NAME}`;
const FRONTEND_DOMAIN         = DOMAIN_NAME;

const ECS_CLUSTER_NAME        = 'TruepointProduction';

interface TruepointStackProps extends cdk.StackProps {
  vpc: ec2.IVpc
}
export class TruepointStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: TruepointStackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************
    const vpc = props!.vpc;

    // *********************************************
    // ************* Security Groups ***************
    // *********************************************

    // Public Load Balancer sec-grp
    const loadBalancerSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}ALBSecGrp`, {
      vpc: vpc,
      securityGroupName: `${ID_PREFIX}PublicALBSecurityGroup`,
      description: 'Allow Inbound traffics for truepoint public ALB.',
      allowAllOutbound: false
    });
    loadBalancerSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow Port 80 for HTTP listener of Public ALB'
    );
    loadBalancerSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow Port 443 for HTTPS listener of Public ALB'
    );
    
    // Backend sec-grp
    const backendSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}BackendSecGrp`, {
      vpc: vpc,
      securityGroupName: `${ID_PREFIX}BackendSecurityGroup`,
      description: 'Allow Inbound traffics for Backend app of Truepoint.',
      allowAllOutbound: true
    });
    backendSecGrp.addIngressRule(
      loadBalancerSecGrp,
      ec2.Port.tcp(BACKEND_PORT),
      `Allow Port ${BACKEND_PORT} for traffics from the truepoint Public ALB`
    );

    // Frontend sec-grp
    const frontendSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}FrontendSecGrp`, {
      vpc: vpc,
      securityGroupName: `${ID_PREFIX}FrontendSecurityGroup`,
      description: 'Allow Inbound traffics for Frontend app of Truepoint.',
      allowAllOutbound: true
    });
    frontendSecGrp.addIngressRule(
      loadBalancerSecGrp,
      ec2.Port.tcp(FRONTEND_PORT),
      `Allow Port ${FRONTEND_PORT} for traffics from the truepoint Public ALB`
    );

    // Database sec-grp
    const databaseSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}DatabaseSecGrp`, {
      vpc: vpc,
      securityGroupName: `${ID_PREFIX}DatabaseSecurityGroup`,
      description: 'Allow Inbound traffics for Database of Truepoint',
      allowAllOutbound: false
    });
    databaseSecGrp.addEgressRule(
      backendSecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      `Allow Port ${DATABASE_PORT} for Outbound traffics to the truepoint Backend`
    );
    databaseSecGrp.addIngressRule(
      backendSecGrp,
      ec2.Port.tcp(DATABASE_PORT),
      `Allow Port ${DATABASE_PORT} for Inobund traffics from the truepoint Backend`
    )

    // *********************************************
    // *********** SSM Parameter Store *************
    // *********************************************
    const ssmParameters = getSSMParams(this);
    
    // *********************************************
    // ******************* ECS *********************
    // *********************************************

    // Define ECS Cluster
    const productionECSCluster = new ecs.Cluster(this, `${ID_PREFIX}productionECSCluster`, {
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
      // secrets: {},
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
      cluster: productionECSCluster,
      taskDefinition: backendTaskDef,
      desiredCount: 1,
      serviceName: `${ID_PREFIX}BackendService`
    });
    
    // *********************************************
    // Create ECS Service for Frontend
    const frontendService = new ecs.FargateService(this, `${ID_PREFIX}FrontendService`, {
      cluster: productionECSCluster,
      taskDefinition: frontendTaskDef,
      desiredCount: 1,
      serviceName: `${ID_PREFIX}FrontendService`
    });


    // *********************************************
    // *********** Certificate manager *************
    // *********************************************
    // const sslCert = acm.Certificate.fromCertificateArn(
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

    // Create Load Balancer
    const publicLoadBalancer = new elbv2.ApplicationLoadBalancer(this, `${ID_PREFIX}PublicLoadBalancer`, {
      vpc: vpc,
      internetFacing: true,
      loadBalancerName: `${ID_PREFIX}Public`,
      securityGroup: loadBalancerSecGrp
    });

    // Define HTTP Listener
    const HTTPListener = publicLoadBalancer.addListener(`${ID_PREFIX}HttpListener`, {
      port: 80,
      defaultTargetGroups: [frontendTargetGroup],
    });
    HTTPListener.addRedirectResponse(`${ID_PREFIX}80to443RedirectTarget`, {
      priority: 1,
      pathPattern: '/*',
      statusCode: 'HTTP_301',
      port: '443',
      protocol: elbv2.Protocol.HTTPS
    });

    // Define HTTPS Listener
    const HTTPSListener = publicLoadBalancer.addListener(`${ID_PREFIX}HttpsListener`, {
      port: 443,
      // certificates: [sslCert],
      sslPolicy: elbv2.SslPolicy.RECOMMENDED,
      defaultTargetGroups: [frontendTargetGroup],
    });
    HTTPSListener.addTargetGroups(`${ID_PREFIX}BackendTargetGroups`, {
      priority: 1,
      targetGroups: [backendTargetGroup],
      hostHeader: BACKEND_DOMAIN,
    });
    HTTPSListener.addTargetGroups(`${ID_PREFIX}FrontendTargetGroups`, {
      priority: 2,
      targetGroups: [frontendTargetGroup],
      hostHeader: FRONTEND_DOMAIN
    });
  

    // *********************************************
    // ***************** Route53 *******************
    // *********************************************
    const HostedZone = new route53.PublicHostedZone(this, `${ID_PREFIX}HostedZone`, {
      zoneName: DOMAIN_NAME,
    });

    new route53.ARecord(this, `${ID_PREFIX}FrontendARecord`, {
      // recordName = hostedzone root domain name
      zone: HostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53targets.LoadBalancerTarget(publicLoadBalancer)
      ),
    });

    new route53.ARecord(this, `${ID_PREFIX}BackendARecord`, {
      zone: HostedZone,
      recordName: BACKEND_SUBDOMAIN,
      target: route53.RecordTarget.fromAlias(
        new route53targets.LoadBalancerTarget(publicLoadBalancer)
      )
    })
    
    // *********************************************
    // ******************* RDS *********************
    // *********************************************
    const dbEngine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_17
    })
    const productionDBInstace = new rds.DatabaseInstance(this, `${ID_PREFIX}ProductionDBInstance`, {
      vpc: vpc,
      engine: dbEngine,
      masterUsername: 'truepoint',
      databaseName: ID_PREFIX,
      instanceIdentifier: `${ID_PREFIX}-RDS-${dbEngine.engineType}`,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      multiAz: true,
      allocatedStorage: 100,
      // Enable storage auto scailing option by specifying maximum allocated storage
      maxAllocatedStorage: 300, // GB
      storageEncrypted: true,
      cloudwatchLogsExports:[
        'error', 'slowquery', 'general'
      ],
      backupRetention: cdk.Duration.days(7),
      cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
      autoMinorVersionUpgrade: true,
      // deletionProtection: true,
      securityGroups: [databaseSecGrp],
      parameterGroup: new rds.ParameterGroup(this, `${ID_PREFIX}ProductionDBParameterGroup`, {
        engine: dbEngine,
        parameters: {
          time_zone: 'Asia/Seoul',
          wait_timeout: '180',
          max_allowed_packet: '16777216', // 16 GB (if memory capacity is lower than this, rds will use the entire memory)
        }
      })
    });

    // *********************************************
    // ************* CloudWatch Alarm **************
    // *********************************************

    // Alarm for DB High CPU
    new cloudwatch.Alarm(this, `${ID_PREFIX}ProductionDBHighCPU`, {
      metric: productionDBInstace.metricCPUUtilization(),
      threshold: 90,
      evaluationPeriods: 1
    });
  }
}