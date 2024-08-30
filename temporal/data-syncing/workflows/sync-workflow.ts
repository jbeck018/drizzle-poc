import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from '../activities/sync-activities';

const {
  startSalesforceBulkQuery,
  pollSalesforceBulkQueryStatus,
  fetchSalesforceData,
  processAndStoreData,
  fetchAndStoreAssociations
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 hour',
});

export async function syncSalesforceWorkflow(objectType: string): Promise<void> {
  const jobId = await startSalesforceBulkQuery(objectType);
  
  let status = await pollSalesforceBulkQueryStatus(jobId);
  while (status !== 'JobComplete') {
    if (status === 'Failed' || status === 'Aborted') {
      throw new Error(`Bulk query job ${jobId} failed with status: ${status}`);
    }
    await sleep(30000); // Wait for 30 seconds before polling again
    status = await pollSalesforceBulkQueryStatus(jobId);
  }

  const data = await fetchSalesforceData(jobId);
  await processAndStoreData(objectType, data);
  await fetchAndStoreAssociations(objectType, data);
}