#!/usr/bin/env node
/* eslint-disable no-console */

import { spawn } from 'child_process';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

const tests = [
  {
    name: 'LocalStack Health Check',
    command: 'curl',
    args: ['-s', 'http://localhost:4566/_localstack/health'],
    validate: (output) => output.includes('running'),
  },
  {
    name: 'DynamoDB - List Tables',
    command: 'docker-compose',
    args: ['exec', '-T', 'localstack', 'awslocal', 'dynamodb', 'list-tables'],
    validate: (output) =>
      output.includes('Users') && output.includes('Jobs') && output.includes('Applications'),
  },
  {
    name: 'SQS - List Queues',
    command: 'docker-compose',
    args: ['exec', '-T', 'localstack', 'awslocal', 'sqs', 'list-queues'],
    validate: (output) => output.includes('email-queue') && output.includes('email-queue-dlq'),
  },
  {
    name: 'S3 - List Buckets',
    command: 'docker-compose',
    args: ['exec', '-T', 'localstack', 'awslocal', 's3', 'ls'],
    validate: (output) => output.includes('jobmatch-bucket'),
  },
  {
    name: 'MailHog - SMTP API',
    command: 'curl',
    args: ['-s', 'http://localhost:8025/api/v1/messages'],
    validate: (output) => output.includes('ID') || output === '[]',
  },
  {
    name: 'MailHog - Web UI',
    command: 'curl',
    args: ['-s', '-o', '/dev/null', '-w', '%{http_code}', 'http://localhost:8025/'],
    validate: (output) => output === '200',
  },
];

async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: 'pipe', shell: true });
    let output = '';
    let error = '';

    proc.stdout.on('data', (data) => (output += data.toString()));
    proc.stderr.on('data', (data) => (error += data.toString()));

    proc.on('close', (code) => {
      if (code === 0 || command === 'curl') {
        resolve(output);
      } else {
        reject(error || output);
      }
    });
  });
}

async function runTests() {
  console.log('🧪 Infrastructure Testing\n');
  console.log('━'.repeat(50));

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n⏳ ${test.name}...`);
      const output = await runCommand(test.command, test.args);

      if (test.validate(output)) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - Validation failed`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ${error}`);
      failed++;
    }

    await sleep(500);
  }

  console.log('\n' + '━'.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('✅ All infrastructure tests passed!');
    console.log('🚀 Ready for backend services development\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Check infrastructure.');
    process.exit(1);
  }
}

runTests().catch(console.error);
