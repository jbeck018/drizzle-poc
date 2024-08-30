import { Connection } from 'jsforce';
import { gunzip } from 'zlib';
import { promisify } from 'util';

const gunzipAsync = promisify(gunzip);

export async function startBulkQuery(connection: Connection, objectType: string): Promise<string> {
  const job = await connection.bulk2.createQueryJob(objectType, 'SELECT Id, (SELECT Id FROM ChildRelationships)', {
    contentType: 'CSV',
    columnDelimiter: 'COMMA',
    lineEnding: 'LF',
  });
  return job.id;
}

export async function getBulkQueryStatus(connection: Connection, jobId: string): Promise<string> {
  const jobInfo = await connection.bulk2.getJobInfo(jobId);
  return jobInfo.state;
}

export async function getBulkQueryResults(connection: Connection, jobId: string): Promise<any[]> {
  const results = await connection.bulk2.getQueryResultStream(jobId);
  const buffer = await streamToBuffer(results);
  const unzippedBuffer = await gunzipAsync(buffer);
  const csvString = unzippedBuffer.toString('utf-8');
  return parseCSV(csvString);
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

function parseCSV(csvString: string): any[] {
  // Implement CSV parsing logic here
  // For simplicity, we'll assume a basic CSV structure
  const lines = csvString.split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {} as any);
  });
}