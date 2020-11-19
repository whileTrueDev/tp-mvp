/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as events from '@aws-cdk/aws-events';
import * as rds from '@aws-cdk/aws-rds';
import * as logs from '@aws-cdk/aws-logs';
import getSSMParams from '../utils/getParams';

interface WhileTrueOutsourcingStackProps extends cdk.StackProps {
  vpc: ec2.IVpc
}

// CONSTANTS
const ID_PREFIX = 'WhileTrueOutSourcing';
const DATABASE_PORT = 3306;
const AFREECA_API_COLLECTOR_FAMILY_NAME = 'whiletrue-afreeca-api';
// const DOMAIN_NAME = 'mytruepoint.com';

export class WhileTrueOutsourcingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: WhileTrueOutsourcingStackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************

    const { vpc } = props!;

    // *********************************************
    // ************* Security Groups ***************
    // *********************************************
    // Database sec-grp
    const databaseSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}DatabaseSecGrp`, {
      vpc,
      // securityGroupName: `${ID_PREFIX}DatabaseSecurityGroup2`,
      description: 'Allow traffics for Database of Truepoint Collector',
      allowAllOutbound: false,
    });
    databaseSecGrp.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(DATABASE_PORT),
      `Allow Port ${DATABASE_PORT} for Outbound traffics to the truepoint Backend`,
    );
    databaseSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(DATABASE_PORT),
      `Allow Port ${DATABASE_PORT} for Inobund traffics from the truepoint Backend`,
    );

    // *********************************************
    // ******************* RDS *********************
    // *********************************************
    const dbEngine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_17,
    });

    const collectorDBInstace = new rds.DatabaseInstance(this, `${ID_PREFIX}DBInstance`, {
      vpc,
      engine: dbEngine,
      masterUsername: 'whiletrue',
      instanceIdentifier: `${ID_PREFIX}RDS-${dbEngine.engineType}`,
      databaseName: ID_PREFIX,
      // *********************************************
      // Free tier instance type for testing and developing
      // please change other instace type when you deploy production
      // *********************************************
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.SMALL),
      // *********************************************
      // For develop and testing.
      // You should change this in production deployment
      // *********************************************
      multiAz: false,
      allocatedStorage: 100,
      vpcPlacement: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      deletionProtection: true,
      // Enable storage auto scailing option by specifying maximum allocated storage
      maxAllocatedStorage: 300, // GB
      autoMinorVersionUpgrade: true,
      securityGroups: [databaseSecGrp],
      parameterGroup: new rds.ParameterGroup(this, `${ID_PREFIX}DBParameterGroup`, {
        engine: dbEngine,
        parameters: {
          time_zone: 'Asia/Seoul',
          wait_timeout: '180',
          max_allowed_packet: '16777216', // 16 GB (if memory capacity is lower than this, rds will use the entire memory)
        },
      }),
      cloudwatchLogsExports: [
        'error', 'slowquery', 'general',
      ],
    });

    // Alarm for DB High CPU
    new cloudwatch.Alarm(this, `${ID_PREFIX}ProductionDBHighCPU`, {
      metric: collectorDBInstace.metricCPUUtilization(),
      threshold: 90,
      evaluationPeriods: 1,
    });

    // *********************************************
    // *********** SSM Parameter Store *************
    // *********************************************
    const ssmParameters = getSSMParams(this);

    // *********************************************
    // ******************* ECS *********************
    // *********************************************

    // Define Collector ECS Cluster
    const ECSCluster = new ecs.Cluster(this, `${ID_PREFIX}ECSCluster`, {
      vpc, clusterName: ID_PREFIX,
    });

    // *************************************************
    // Define task definition of Afreeca API Collector
    const afreecaLogGroup = new logs.LogGroup(
      this, `${ID_PREFIX}${AFREECA_API_COLLECTOR_FAMILY_NAME}LogGroup`, {
        logGroupName: `/ecs/${AFREECA_API_COLLECTOR_FAMILY_NAME}`,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );
    const afreecaTaskDef = new ecs.FargateTaskDefinition(
      this, `${ID_PREFIX}${AFREECA_API_COLLECTOR_FAMILY_NAME}TaskDef`,
      { family: AFREECA_API_COLLECTOR_FAMILY_NAME, memoryLimitMiB: 1024 },
    );
    afreecaTaskDef.addContainer(
      `${ID_PREFIX}${AFREECA_API_COLLECTOR_FAMILY_NAME}Container`, {
        image: ecs.ContainerImage.fromRegistry(`hwasurr/${AFREECA_API_COLLECTOR_FAMILY_NAME}`),
        memoryLimitMiB: 1024,
        secrets: {
          AFREECA_KEY: ecs.Secret.fromSsmParameter(ssmParameters.AFREECA_KEY),
          AWS_ACCESS_KEY_ID: ecs.Secret.fromSsmParameter(ssmParameters.TRUEPOINT_ACCESS_KEY_ID),
          AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSsmParameter(ssmParameters.TRUEPOINT_SECRET_ACCESS_KEY),
        },
        logging: new ecs.AwsLogDriver({ logGroup: afreecaLogGroup, streamPrefix: 'ecs' }),
      },
    );

    // *********************************************
    // Create ScheduledFargateTask for Twitchtv Collector
    new ecsPatterns.ScheduledFargateTask(this,
      `${AFREECA_API_COLLECTOR_FAMILY_NAME}Task`, {
        cluster: ECSCluster,
        desiredTaskCount: 1,
        scheduledFargateTaskDefinitionOptions: {
          taskDefinition: afreecaTaskDef,
        },
        schedule: events.Schedule.expression('cron(*/3 * * * ? *)'),
      });
  }
}
