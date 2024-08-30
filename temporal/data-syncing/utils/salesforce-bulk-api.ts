import { Connection } from 'jsforce';
import { Readable } from 'stream';
import csv from 'csv-parser';

export async function streamBulkQuery(connection: Connection, objectType: string): Promise<Readable> {
  const stream = await connection.bulk2.query(`SELECT FIELDS(ALL) FROM ${objectType}`);
  return stream.pipe(csv());
}