#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as dotenv from 'dotenv'
import { TruepointStack } from '../lib/truepoint-production-stack';

dotenv.config();

const app = new cdk.App();
new TruepointStack(app, 'TruepointStack', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_ONAD_REGION,
  }
});
