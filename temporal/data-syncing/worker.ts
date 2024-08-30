import { Worker } from '@temporalio/worker';
import * as syncActivities from './activities/sync-activities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities: syncActivities,
    taskQueue: 'salesforce-sync',
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});