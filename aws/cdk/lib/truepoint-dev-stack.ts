/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as rds from '@aws-cdk/aws-rds';
import * as logs from '@aws-cdk/aws-logs';
import * as ssm from '@aws-cdk/aws-ssm';
import * as iam from '@aws-cdk/aws-iam';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { ListenerAction, ListenerCondition } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as acm from '@aws-cdk/aws-certificatemanager';
// import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
// import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
// import * as events from '@aws-cdk/aws-events';
// import getSSMParams from '../utils/getParams';

// CONSTANTS
const DOMAIN = 'mytruepoint.com';
const ID_PREFIX = 'TruepointDev';
const SSL_CERTIFICATE_ARN = 'arn:aws:acm:ap-northeast-2:576646866181:certificate/68f8f35a-bd5d-492b-8f58-c0152b60b71f';
// DB
const DATABASE_PORT = 3306;
// API SERVER
const API_HOST_HEADER = 'api';
const API_SERVER_PORT = 3000;
const API_SERVER_NAME = 'truepoint-api';
// FRONTEND WEB
const FRONT_WEB_PORT = 3001;
const FRONT_WEB_NAME = 'truepoint-web';

export class TruepointDevStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // *********************************************
    // ************** VPC and Subnets **************
    // *********************************************
    const vpc = new ec2.Vpc(this, `${ID_PREFIX}Vpc`, {
      cidr: '11.0.0.0/24',
      maxAzs: 4, // To use all Avaliability Zone
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC, // For internet-facing load balancer
          name: 'Public for Dev',
        },
      ],
    });

    // *********************************************
    // ******************* RDS *********************
    // *********************************************

    // 데이터베이스 보안그룹 생성 작업
    const databaseSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}DatabaseSecGrp`, {
      vpc,
      securityGroupName: `${ID_PREFIX}DatabaseSecurityGroup`,
      description: 'Allow traffics for Dev Database of Truepoint',
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

    const dbEngine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_17,
    });
    new rds.DatabaseInstance(this, `${ID_PREFIX}DBInstance`, {
      vpc,
      engine: dbEngine,
      masterUsername: 'truepoint',
      instanceIdentifier: `${ID_PREFIX}-RDS-${dbEngine.engineType}`,
      databaseName: ID_PREFIX,
      // *********************************************
      // Free tier instance type for testing and developing
      // please change other instace type when you deploy production
      // *********************************************
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      // *********************************************
      // For develop and testing.
      // You should change this in production deployment
      // *********************************************
      vpcPlacement: { subnetType: ec2.SubnetType.PUBLIC },
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
        },
      }),
      deletionProtection: false,
    });

    // ALB https 리스너를 위해 ssl Certificates 를 가져옵니다.

    /** ********************************************
    ************* Truepoint ECS Cluster **************
    ************************************************ */
    // 클러스터 생성
    const truepointCluster = new ecs.Cluster(this, `${ID_PREFIX}Cluster`, {
      vpc, clusterName: ID_PREFIX,
    });

    // EcsTaskRole 생성
    const truepointTaskRole = new iam.Role(this, 'ecsTaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    // 생성한 Role에 ECS Task 실행 기본 정책 추가
    truepointTaskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
    );
    // SSM - ParameterStore 접근 권한 부여
    truepointTaskRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [`arn:aws:ssm:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:parameter/*`],
        actions: ['ssm:GetParameters'],
      }),
    );

    /** ********************************************
    *************** API 서버 ECS task ****************
    ************************************************ */

    // API 서버 보안그룹 생성 작업
    const apiSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}ApiSecGrp`, {
      vpc, securityGroupName: 'Truepoint-Api-SecGrp', allowAllOutbound: true,
    });
    apiSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(API_SERVER_PORT));

    // API 서버 cloudwatch 로그 그룹
    const apiLogGroup = new logs.LogGroup(this, `${ID_PREFIX}ApiLogGroup`, {
      logGroupName: `/ecs/${API_SERVER_NAME}`, removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // API 서버 작업 정의(Task Definition)
    const apiTaskDef = new ecs.FargateTaskDefinition(this, `${ID_PREFIX}ApiTaskDef`, {
      family: API_SERVER_NAME, memoryLimitMiB: 512, cpu: 256, taskRole: truepointTaskRole,
    });
    const apiContainer = apiTaskDef.addContainer(`${ID_PREFIX}ApiContainer`, {
      image: ecs.ContainerImage.fromRegistry(`hwasurr/${API_SERVER_NAME}`),
      cpu: 256, // 해당 컨테이너의 최소 필요 cpu
      memoryLimitMiB: 512, // 해당 컨테이너의 최소 필요 memory
      logging: new ecs.AwsLogDriver({ logGroup: apiLogGroup, streamPrefix: '/ecs' }),
      secrets: { // 필요 시크릿 값
        // AWS credentials
        AWS_ACCESS_KEY_ID: ecs.Secret.fromSsmParameter(this.getSecureParam('TRUEPOINT_ACCESS_KEY_ID')),
        AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSsmParameter(this.getSecureParam('TRUEPOINT_SECRET_ACCESS_KEY')),
        BUCKET_NAME: ecs.Secret.fromSsmParameter(this.getStringParam('TRUEPOINT_BUCKET_NAME')),

        // Jwt secret
        JWT_SECRET: ecs.Secret.fromSsmParameter(this.getSecureParam('TRUEPOINT_JWT_TOKEN')),

        // IMPORT secret
        IMP_KEY: ecs.Secret.fromSsmParameter(this.getSecureParam('IMP_KEY')),
        IMP_SECRET: ecs.Secret.fromSsmParameter(this.getSecureParam('IMP_SECRET')),

        // # Slack Secret
        SLACK_ALARM_URL: ecs.Secret.fromSsmParameter(this.getSecureParam('TRUEPOINT_SLACK_URL')),

        // # Twitch Secrets
        TWITCH_CLIENT_ID: ecs.Secret.fromSsmParameter(this.getSecureParam('TRUEPOINT_TWITCH_CLIENT_ID')),
        TWITCH_CLIENT_SECRET: ecs.Secret.fromSsmParameter(this.getSecureParam('TRUEPOINT_TWITCH_CLIENT_SECRET')),

        // # Google/Youtube Secrets
        YOUTUBE_CLIENT_ID: ecs.Secret.fromSsmParameter(this.getSecureParam('YOUTUBE_CLIENT_ID')),
        YOUTUBE_CLIENT_SECRET: ecs.Secret.fromSsmParameter(this.getSecureParam('YOUTUBE_CLIENT_SECRET')),

        // # Afreeca Secrets
        AFREECA_KEY: ecs.Secret.fromSsmParameter(this.getSecureParam('AFREECA_KEY')),
        AFREECA_SECRET_KEY: ecs.Secret.fromSsmParameter(this.getSecureParam('AFREECA_SECRET_KEY')),
      },
    });
    apiContainer.addPortMappings({ containerPort: API_SERVER_PORT });

    // ECS cluster 내에 Api Service 생성
    const apiService = new ecs.FargateService(this, `${ID_PREFIX}ApiService`, {
      cluster: truepointCluster,
      serviceName: `${API_SERVER_NAME}Service`,
      taskDefinition: apiTaskDef,
      assignPublicIp: true,
      desiredCount: 1,
      securityGroups: [apiSecGrp],
    });

    // ALB 타겟 그룹으로 생성
    const apiTargetGroup = new elbv2.ApplicationTargetGroup(this, `${ID_PREFIX}ApiTargetGroup`, {
      vpc,
      targetGroupName: `${API_SERVER_NAME}TargetGroup`,
      port: API_SERVER_PORT,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [apiService],
    });

    /** ********************************************
    ************* FrontWeb 서버 ECS task *************
    ************************************************ */
    // 프론트 Web 서버 보안그룹 생성 작업
    const frontwebSecGrp = new ec2.SecurityGroup(this, `${ID_PREFIX}WebSecGrp`, {
      vpc, securityGroupName: 'Truepoint-Web-SecGrp', allowAllOutbound: true,
    });
    frontwebSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(FRONT_WEB_PORT));

    // 프론트 Web 서버 cloudwatch 로그 그룹
    const frontwebLogGroup = new logs.LogGroup(this, `${ID_PREFIX}WebLogGroup`, {
      logGroupName: `/ecs/${FRONT_WEB_NAME}`, removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 프론트 Web 서버 작업 정의(Task Definition)
    const frontwebTaskDef = new ecs.FargateTaskDefinition(this, `${ID_PREFIX}WebTaskDef`, {
      family: API_SERVER_NAME, memoryLimitMiB: 512, cpu: 256, taskRole: truepointTaskRole,
    });

    const frontContainer = apiTaskDef.addContainer(`${ID_PREFIX}WebContainer`, {
      image: ecs.ContainerImage.fromRegistry(`hwasurr/${FRONT_WEB_NAME}`),
      cpu: 256, // 해당 컨테이너의 최소 필요 cpu
      memoryLimitMiB: 512, // 해당 컨테이너의 최소 필요 memory
      logging: new ecs.AwsLogDriver({ logGroup: frontwebLogGroup, streamPrefix: '/ecs' }),
    });
    frontContainer.addPortMappings({ containerPort: FRONT_WEB_PORT });

    // ECS cluster 내에 front web Service 생성
    const frontwebService = new ecs.FargateService(this, `${ID_PREFIX}WebService`, {
      cluster: truepointCluster,
      serviceName: `${FRONT_WEB_NAME}Service`,
      taskDefinition: frontwebTaskDef,
      assignPublicIp: true,
      desiredCount: 1,
      securityGroups: [frontwebSecGrp],
    });

    // ALB 타겟 그룹으로 생성
    const frontwebTargetGroup = new elbv2.ApplicationTargetGroup(this, `${ID_PREFIX}WebTargetGroup`, {
      vpc,
      targetGroupName: `${FRONT_WEB_NAME}TargetGroup`,
      port: FRONT_WEB_PORT,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [frontwebService],
    });

    // **********************************************
    // ******************** ALB *********************
    // **********************************************

    // ALB 생성
    const truepointALB = new elbv2.ApplicationLoadBalancer(this, `${ID_PREFIX}ALB`, {
      vpc, internetFacing: true, loadBalancerName: `${ID_PREFIX}ALB`,
    });

    // **********************************************
    // ALB - HTTP ***********************************

    // ALB에 Http 리스너 추가
    const truepointHttpListener = truepointALB.addListener(`${ID_PREFIX}ALBHttpListener`, {
      port: 80,
      defaultTargetGroups: [frontwebTargetGroup], // 기본 타겟 그룹은 프론트엔드.
    });

    // HTTP리스너에 http -> https 리다이렉트 액션 추가
    truepointHttpListener.addAction('80to440Redirect', {
      priority: 1,
      action: ListenerAction.redirect({
        path: '/*',
        port: '443',
        protocol: elbv2.Protocol.HTTPS,
      }),
    });
    truepointHttpListener.connections.allowDefaultPortFromAnyIpv4('HTTP ALB open to world');

    // **********************************************
    // ALB - HTTPS **********************************

    // HTTPS 리스너를 위해 SSL Certificates 생성
    const sslCert = acm.Certificate.fromCertificateArn(
      this, 'DnsCertificates', SSL_CERTIFICATE_ARN,
    );

    // ALB에 Https 리스너 추가
    const truepointHttpsListener = truepointALB.addListener(`${ID_PREFIX}ALBHttpsListener`, {
      port: 443,
      certificates: [sslCert],
      sslPolicy: elbv2.SslPolicy.RECOMMENDED,
      defaultTargetGroups: [frontwebTargetGroup], // 기본 타겟 그룹은 프론트엔드.
    });
    truepointHttpsListener.connections.allowDefaultPortFromAnyIpv4('https ALB open to world');

    // HTTPS 리스너에 front WEB 서버 타겟그룹 추가
    truepointHttpsListener.addTargetGroups(`${ID_PREFIX}HTTPSWebTargetGroup`, {
      priority: 1,
      conditions: [
        ListenerCondition.hostHeaders([DOMAIN]),
      ],
      targetGroups: [frontwebTargetGroup],
    });

    // HTTPS 리스너에 API서버 타겟그룹 추가
    truepointHttpsListener.addTargetGroups(`${ID_PREFIX}HTTPSApiTargetGroup`, {
      priority: 2,
      conditions: [
        ListenerCondition.hostHeaders([`${API_HOST_HEADER}.${DOMAIN}`]),
      ],
      targetGroups: [apiTargetGroup],
    });
  }

  /**
   * AWS SSM ParameterStore의 문자열 파라미터에 접근해 해당 파라미터를 반환하는 메서드 (String)
   * @param id 찾고자 하는 파라미터값의 ssm parameter store 키값
   * @param version 해당 파라미터 값의 버전 (대부분 1)
   */
  private getStringParam(id: string, version = 1) {
    return ssm.StringParameter.fromStringParameterAttributes(
      this, id, { parameterName: id, version },
    );
  }

  /**
   * AWS SSM PramaterStore의 보안문자열 파라미터에 접근해 해당 파라미터를 반환하는 메서드 (SecureString)
   * @param id 찾고자 하는 파리미터의 ssm parameter store 키값
   * @param version 해당 파리미터의 버전 (대부분 1)
   */
  private getSecureParam(id: string, version = 1) {
    return ssm.StringParameter.fromSecureStringParameterAttributes(
      this, id, { parameterName: id, version },
    );
  }
}
