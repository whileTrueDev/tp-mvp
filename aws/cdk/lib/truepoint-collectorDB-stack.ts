import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as rds from '@aws-cdk/aws-rds';

interface WhileTrueCollectorStackProps extends cdk.StackProps {
  vpc: ec2.IVpc
}

// CONSTANTS
const ID_PREFIX               = 'WhileTrueCollector';
const DATABASE_PORT           = 3306;

export class WhileTrueCollectorStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: WhileTrueCollectorStackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************

    const vpc = props!.vpc;
    
    // *********************************************
    // ************* Security Groups ***************
    // *********************************************
    // Database sec-grp
    const databaseSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}DatabaseSecGrp`, {
      vpc: vpc,
      securityGroupName: `${ID_PREFIX}DatabaseSecurityGroup`,
      description: 'Allow traffics for Database of Truepoint',
      allowAllOutbound: false
    });
    databaseSecGrp.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(DATABASE_PORT),
      `Allow Port ${DATABASE_PORT} for Outbound traffics to the truepoint Backend`
    );
    databaseSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(DATABASE_PORT),
      `Allow Port ${DATABASE_PORT} for Inobund traffics from the truepoint Backend`
    );

    // *********************************************
    // ******************* RDS *********************
    // *********************************************
    const dbEngine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_17
    });
    
    const collectorDBInstace = new rds.DatabaseInstance(this, `${ID_PREFIX}DBInstance`, {
      vpc: vpc,
      engine: dbEngine,
      masterUsername: 'truepoint',
      instanceIdentifier: `${ID_PREFIX}RDS-${dbEngine.engineType}`,
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
        }
      }),
      cloudwatchLogsExports:[
        'error', 'slowquery', 'general'
      ],
    });

    // Alarm for DB High CPU
    new cloudwatch.Alarm(this, `${ID_PREFIX}ProductionDBHighCPU`, {
      metric: collectorDBInstace.metricCPUUtilization(),
      threshold: 90,
      evaluationPeriods: 1
    });
  }
}
