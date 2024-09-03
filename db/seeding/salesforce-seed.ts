import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Connection, SObjectCreate } from 'jsforce';

dotenv.config();

// Add this new function to seed leads
const seedSalesforceLeads = async (conn: Connection) => {
	console.log('Starting Salesforce lead seeding...');
	
	const leadsToCreate: SObjectCreate[] = [...Array(50)].map(() => ({
		FirstName: faker.person.firstName(),
		LastName: faker.person.lastName(),
		Company: faker.company.name(),
		Title: faker.person.jobTitle(),
		Email: faker.internet.email(),
		Phone: faker.phone.number(),
		Status: faker.helpers.arrayElement(['Open - Not Contacted', 'Working - Contacted', 'Closed - Converted', 'Closed - Not Converted']),
		LeadSource: faker.helpers.arrayElement(['Web', 'Phone Inquiry', 'Partner Referral', 'Purchased List', 'Other']),
		Industry: faker.helpers.arrayElement(['Agriculture', 'Apparel', 'Banking', 'Biotechnology', 'Chemicals', 'Communications', 'Construction', 'Consulting', 'Education', 'Electronics', 'Energy', 'Engineering', 'Entertainment', 'Environmental', 'Finance', 'Food & Beverage', 'Government', 'Healthcare', 'Hospitality', 'Insurance', 'Machinery', 'Manufacturing', 'Media', 'Not For Profit', 'Recreation', 'Retail', 'Shipping', 'Technology', 'Telecommunications', 'Transportation', 'Utilities', 'Other']),
		Description: faker.lorem.paragraph(),
		Rating: faker.helpers.arrayElement(['Hot', 'Warm', 'Cold']),
	}));

	const leadResults = await conn.sobject('Lead').create(leadsToCreate);
	const successfulLeads = leadResults.filter(result => result.success);
	console.log(`Successfully created ${successfulLeads.length} Salesforce Leads`);

	// Add this block to create tasks for leads
	for (const lead of successfulLeads) {
		const taskToCreate = {
			WhoId: lead.id,
			Subject: faker.lorem.sentence(),
			Status: faker.helpers.arrayElement(['Not Started', 'In Progress', 'Completed', 'Waiting on someone else', 'Deferred']),
			Priority: faker.helpers.arrayElement(['High', 'Normal', 'Low']),
			Description: faker.lorem.paragraph(),
		};

		const taskResult = await conn.sobject('Task').create(taskToCreate);
		if (taskResult.success) {
			console.log(`Created task for Lead ${lead.id}`);
		}
	}
};

export const seedSalesforceData = async () => {
	console.log('Starting Salesforce account seeding...');
	if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD || !process.env.SALESFORCE_TOKEN || !process.env.SALESFORCE_LOGIN_URL) {
		console.log('Salesforce environment variables are not set. Skipping Salesforce account seeding.');
		return;
	}

	const conn = new Connection({
		loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
	});

	try {
		console.log('Attempting to login to Salesforce...');
		await conn.login(
			process.env.SALESFORCE_USERNAME,
			process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_TOKEN
			);
		console.log('Successfully logged in to Salesforce');

		const accountsToCreate: SObjectCreate[] = [...Array(100)].map(() => ({
			Name: faker.company.name(),
			Type: faker.helpers.arrayElement(['Prospect', 'Customer - Direct', 'Customer - Channel', 'Channel Partner / Reseller', 'Installation Partner', 'Technology Partner', 'Other']),
			ParentId: null,
			BillingStreet: faker.location.streetAddress(),
			BillingCity: faker.location.city(),
			BillingState: faker.location.state(),
			BillingPostalCode: faker.location.zipCode(),
			BillingCountry: faker.location.country(),
			ShippingStreet: faker.location.streetAddress(),
			ShippingCity: faker.location.city(),
			ShippingState: faker.location.state(),
			ShippingPostalCode: faker.location.zipCode(),
			ShippingCountry: faker.location.country(),
			Phone: faker.phone.number(),
			Fax: faker.phone.number(),
			AccountNumber: faker.finance.accountNumber(),
			Website: faker.internet.url(),
			Sic: faker.finance.bic(),
			Industry: faker.helpers.arrayElement(['Agriculture', 'Apparel', 'Banking', 'Biotechnology', 'Chemicals', 'Communications', 'Construction', 'Consulting', 'Education', 'Electronics', 'Energy', 'Engineering', 'Entertainment', 'Environmental', 'Finance', 'Food & Beverage', 'Government', 'Healthcare', 'Hospitality', 'Insurance', 'Machinery', 'Manufacturing', 'Media', 'Not For Profit', 'Recreation', 'Retail', 'Shipping', 'Technology', 'Telecommunications', 'Transportation', 'Utilities', 'Other']),
			AnnualRevenue: faker.number.float({ min: 10000, max: 1000000000, multipleOf: 0.01 }),
			NumberOfEmployees: faker.number.int({ min: 1, max: 100000 }),
			Ownership: faker.helpers.arrayElement(['Public', 'Private', 'Subsidiary', 'Other']),
			TickerSymbol: faker.finance.currencyCode(),
			Description: faker.company.catchPhrase(),
			Rating: faker.helpers.arrayElement(['Hot', 'Warm', 'Cold']),
			Site: faker.internet.domainName(),
			CustomerPriority__c: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
			SLA__c: faker.helpers.arrayElement(['Gold', 'Silver', 'Bronze', 'Platinum']),
			Active__c: faker.datatype.boolean().toString(),
			NumberofLocations__c: faker.number.int({ min: 1, max: 100 }),
			UpsellOpportunity__c: faker.helpers.arrayElement(['Maybe', 'No', 'Yes']),
			SLAExpirationDate__c: faker.date.future().toISOString().split('T')[0],
			SLASerialNumber__c: faker.string.alphanumeric(10),
		}));

		const accountResults = await conn.sobject('Account').create(accountsToCreate);

		const successfulAccounts = accountResults.filter(result => result.success);
		console.log(`Successfully created ${successfulAccounts.length} Salesforce Accounts`);

		for (const account of successfulAccounts) {
			const opportunitiesToCreate = [...Array(3)].map(() => ({
				AccountId: account.id,
				Name: faker.commerce.productName(),
				StageName: faker.helpers.arrayElement(['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']),
				CloseDate: faker.date.future().toISOString().split('T')[0],
				Amount: faker.number.float({ min: 1000, max: 100000, multipleOf: 0.01 }),
				Type: faker.helpers.arrayElement(['New Customer', 'Existing Customer - Upgrade', 'Existing Customer - Replacement', 'Existing Customer - Downgrade']),
				LeadSource: faker.helpers.arrayElement(['Web', 'Phone Inquiry', 'Partner Referral', 'Purchased List', 'Other']),
				NextStep: faker.lorem.sentence(),
				Description: faker.lorem.paragraph(),
				Probability: faker.number.int({ min: 0, max: 100 }),
				TotalOpportunityQuantity: faker.number.int({ min: 1, max: 100 }),
				ForecastCategoryName: faker.helpers.arrayElement(['Pipeline', 'Best Case', 'Commit', 'Closed']),
			}));
		  
			const contactsToCreate = [...Array(3)].map(() => ({
				AccountId: account.id,
				Salutation: faker.helpers.arrayElement(['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.']),
				FirstName: faker.person.firstName(),
				LastName: faker.person.lastName(),
				Email: faker.internet.email(),
				Phone: faker.phone.number(),
				MobilePhone: faker.phone.number(),
				Title: faker.person.jobTitle(),
				Department: faker.commerce.department(),
				MailingStreet: faker.location.streetAddress(),
				MailingCity: faker.location.city(),
				MailingState: faker.location.state(),
				MailingPostalCode: faker.location.zipCode(),
				MailingCountry: faker.location.country(),
				OtherStreet: faker.location.streetAddress(),
				OtherCity: faker.location.city(),
				OtherState: faker.location.state(),
				OtherPostalCode: faker.location.zipCode(),
				OtherCountry: faker.location.country(),
				Fax: faker.phone.number(),
				HomePhone: faker.phone.number(),
				OtherPhone: faker.phone.number(),
				AssistantName: faker.person.fullName(),
				AssistantPhone: faker.phone.number(),
				LeadSource: faker.helpers.arrayElement(['Web', 'Phone Inquiry', 'Partner Referral', 'Purchased List', 'Other']),
				Birthdate: faker.date.past({ years: 60 }).toISOString().split('T')[0],
				Description: faker.lorem.paragraph(),
				EmailBouncedReason: null,
				EmailBouncedDate: null,
				Level__c: faker.helpers.arrayElement(['Primary', 'Secondary', 'Tertiary']),
				Languages__c: faker.helpers.arrayElement(['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'])
			}));

			const casesToCreate = [...Array(3)].map(() => ({
				AccountId: account.id,
				Subject: faker.lorem.sentence(),
				Status: faker.helpers.arrayElement(['New', 'Working', 'Escalated', 'Closed']),
				Origin: faker.helpers.arrayElement(['Phone', 'Email', 'Web']),
				Priority: faker.helpers.arrayElement(['High', 'Medium', 'Low'])
			}));

			const notesToCreate = [...Array(3)].map(() => ({
				ParentId: account.id,
				Title: faker.lorem.sentence(),
				Body: faker.lorem.paragraph()
			}));

			const attachmentsToCreate = [...Array(3)].map(() => ({
				ParentId: account.id,
				Name: faker.system.fileName(),
				Body: Buffer.from(faker.lorem.paragraph()).toString('base64'),
				ContentType: 'text/plain'
			}));

			const [opportunityResults, contactResults, caseResults, noteResults, attachmentResults] = await Promise.all([
				conn.sobject('Opportunity').create(opportunitiesToCreate),
				conn.sobject('Contact').create(contactsToCreate),
				conn.sobject('Case').create(casesToCreate),
				conn.sobject('Note').create(notesToCreate),
				conn.sobject('Attachment').create(attachmentsToCreate)
			]);

			console.log(`For Account ${account.id}:`);
			console.log(`- Created ${opportunityResults.filter(r => r.success).length} Opportunities`);
			console.log(`- Created ${contactResults.filter(r => r.success).length} Contacts`);
			console.log(`- Created ${caseResults.filter(r => r.success).length} Cases`);
			console.log(`- Created ${noteResults.filter(r => r.success).length} Notes`);
			console.log(`- Created ${attachmentResults.filter(r => r.success).length} Attachments`);

			// Add this block to create tasks for contacts
			for (const contact of contactResults.filter(r => r.success)) {
				const taskToCreate = {
					WhoId: contact.id,
					Subject: faker.lorem.sentence(),
					Status: faker.helpers.arrayElement(['Not Started', 'In Progress', 'Completed', 'Waiting on someone else', 'Deferred']),
					Priority: faker.helpers.arrayElement(['High', 'Normal', 'Low']),
					Description: faker.lorem.paragraph(),
				};

				const taskResult = await conn.sobject('Task').create(taskToCreate);
				if (taskResult.success) {
					console.log(`Created task for Contact ${contact.id}`);
				}
			}

			console.log(`- Created ${contactResults.filter(r => r.success).length} Tasks for Contacts`);
		}

		console.log('Finished creating Salesforce Accounts and related records');

		// Add this line to call the new lead seeding function
		await seedSalesforceLeads(conn);

	} catch (err) {
		console.error('Error in Salesforce login:', err.message);
		if (err.errorCode) {
			console.error('Salesforce error code:', err.errorCode);
		}
		if (err.stack) {
			console.error('Error stack:', err.stack);
		}
	} finally {
		if (conn.accessToken) {
			await conn.logout();
			console.log('Logged out of Salesforce');
		}
	}
};

export const removeSalesforceData = async () => {
	console.log('Starting Salesforce data removal...');
	if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD || !process.env.SALESFORCE_TOKEN || !process.env.SALESFORCE_LOGIN_URL) {
		console.log('Salesforce environment variables are not set. Skipping Salesforce data removal.');
		return;
	}

	const conn = new Connection({
		loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
	});

	try {
		console.log('Attempting to login to Salesforce...');
		await conn.login(
			process.env.SALESFORCE_USERNAME,
			process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_TOKEN
		);
		console.log('Successfully logged in to Salesforce');

		const objectsToDelete = ['Lead', 'Task', 'Campaign', 'Account', 'Opportunity', 'Contact', 'Case', 'Note', 'Attachment'];

		for (const objectName of objectsToDelete) {
			console.log(`Deleting all ${objectName} records...`);
			let done = false;
			let query = `SELECT Id FROM ${objectName}`;

			while (!done) {
				const records = await conn.query(query);
				if (records.totalSize > 0) {
					const ids = records.records.map(record => record.Id as string);
					const chunks = [];
					for (let i = 0; i < ids.length; i += 200) {
						chunks.push(ids.slice(i, i + 200));
					}

					for (const chunk of chunks) {
						const result = await conn.sobject(objectName).delete(chunk);
						console.log(`Deleted ${result.filter(r => r.success).length} ${objectName} records`);
					}

					if (!records.done) {
						query = records.nextRecordsUrl;
					} else {
						done = true;
					}
				} else {
					console.log(`No ${objectName} records found to delete`);
					done = true;
				}
			}
		}

		console.log('Finished removing Salesforce data');

	} catch (err) {
		console.error('Error in Salesforce data removal:', err.message);
		if (err.errorCode) {
			console.error('Salesforce error code:', err.errorCode);
		}
		if (err.stack) {
			console.error('Error stack:', err.stack);
		}
	} finally {
		if (conn.accessToken) {
			await conn.logout();
			console.log('Logged out of Salesforce');
		}
	}
};