import { db } from '#db/db.server';
import { rawRecord, associations } from '#/db/schema';
import { createSalesforceConnection } from '../utils/salesforce-connection';
import { streamBulkQuery } from '../utils/salesforce-bulk-api';

export async function streamAndStoreSalesforceData(objectType: string): Promise<void> {
  const sfConnection = await createSalesforceConnection();
  try {
    const stream = await streamBulkQuery(sfConnection, objectType);
    
    for await (const record of stream) {
      await processAndStoreRecord(objectType, record);
      await fetchAndStoreAssociations(objectType, record);
    }
  } finally {
    await sfConnection.logout();
  }
}

async function processAndStoreRecord(objectType: string, record: any) {
  await db.insert(rawRecord).values({
    objectType,
    externalId: record.Id,
    data: record,
  }).onConflictDoUpdate({
    target: [rawRecord.objectType, rawRecord.externalId],
    set: { data: record, updatedAt: new Date() },
  });
}

async function fetchAndStoreAssociations(objectType: string, record: any) {
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