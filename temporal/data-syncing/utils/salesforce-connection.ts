import { Connection } from 'jsforce';

export async function createSalesforceConnection() {
  return new Connection({
    // Add your Salesforce connection details here
    // For example:
    // loginUrl: process.env.SF_LOGIN_URL,
    // username: process.env.SF_USERNAME,
    // password: process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
  });
}