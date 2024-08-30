import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/sync-activities';

const { streamAndStoreSalesforceData } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 hour',
});

export async function syncSalesforceData(objectType: string): Promise<void> {
  await streamAndStoreSalesforceData(objectType);
}