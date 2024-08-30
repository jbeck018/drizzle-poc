import { db } from '#db/db.server';
import { rawRecord, associations } from '#/db/schema';
import { createSalesforceConnection } from '../utils/salesforce-connection';
import { startBulkQuery, getBulkQueryStatus, getBulkQueryResults } from '../utils/salesforce-bulk-api';

export async function startSalesforceBulkQuery(objectType: string): Promise<string> {
  const sfConnection = await createSalesforceConnection();
  try {
    return await startBulkQuery(sfConnection, objectType);
  } finally {
    await sfConnection.logout();
  }
}

export async function pollSalesforceBulkQueryStatus(jobId: string): Promise<string> {
  const sfConnection = await createSalesforceConnection();
  try {
    return await getBulkQueryStatus(sfConnection, jobId);
  } finally {
    await sfConnection.logout();
  }
}

export async function fetchSalesforceData(jobId: string): Promise<any[]> {
  const sfConnection = await createSalesforceConnection();
  try {
    return await getBulkQueryResults(sfConnection, jobId);
  } finally {
    await sfConnection.logout();
  }
}

export async function processAndStoreData(objectType: string, data: any[]) {
  for (const record of data) {
    await db.insert(rawRecord).values({
      objectType,
      externalId: record.Id,
      data: record,
    }).onConflictDoUpdate({
      target: [rawRecord.objectType, rawRecord.externalId],
      set: { data: record, updatedAt: new Date() },
    });
  }
}

export async function fetchAndStoreAssociations(objectType: string, data: any[]) {
  for (const record of data) {
    for (const [relationshipName, relatedRecords] of Object.entries(record)) {
      if (Array.isArray(relatedRecords)) {
        for (const relatedRecord of relatedRecords) {
          await db.insert(associations).values({
            sourceObjectType: objectType,
            sourceExternalId: record.Id,
            targetObjectType: relationshipName,
            targetExternalId: relatedRecord.Id,
            associationType: relationshipName,
          }).onConflictDoNothing();
        }
      }
    }
  }
}