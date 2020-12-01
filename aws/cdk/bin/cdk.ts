#!/usr/bin/env node
/* eslint-disable no-new */
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as dotenv from 'dotenv';
// import { TruepointStack } from '../lib/truepoint-production-stack';
import { TruepointDevStack } from '../lib/truepoint-dev-stack';
import { WhileTrueCollectorStack } from '../lib/truepoint-collectorDB-stack';
import { WhileTrueTruepointVpcStack } from '../lib/vpc-stack';

dotenv.config();

const app = new cdk.App();
const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_ONAD_REGION,
};

// **********************************
// Truepoint Development Stack
// **********************************
new TruepointDevStack(app, 'TruepointDev', { env });

// **********************************
// VPC stack
// **********************************
const TrupointVpcStack = new WhileTrueTruepointVpcStack(app, 'WhileTrue', { env });

// **********************************
// Collector DB Stack
// **********************************
new WhileTrueCollectorStack(
  app,
  'WhileTrueCollector',
  { env, vpc: TrupointVpcStack.vpc },
);

// **********************************
// Truepoint Production Stack
// **********************************
// new TruepointStack(
//   app,
//   'TruepointProduction',
//   { env, vpc: TrupointVpcStack.vpc }
// );
