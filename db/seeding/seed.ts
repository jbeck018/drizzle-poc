import { faker } from "@faker-js/faker";
import { db } from '../index'
import { chunk, sample, sampleSize, uniqBy } from "lodash";
import { users, events, eventTypeEnumValues, records, recordType, properties, recordTypeEnum, recordTypeEnumValues, propertyTypeEnumValues } from "../schema";

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }


  const seedAccounts = async () => {
    // Generate property metadata once
    const propertyTypes = [...propertyTypeEnumValues];
    const propertyMetadata = generatePropertyMetadata(propertyTypes);

    // Delete existing records
    await db.delete(records);

    // Insert accounts in batches of 1000
    for (let batch = 0; batch < 100; batch++) {
        const accountData = generateAccountData(1000);
        const insertedAccounts = await db.insert(records).values(accountData).returning({ id: records.id, createdAt: records.createdAt, updatedAt: records.updatedAt });
        console.log(`Inserted ${insertedAccounts.length} Accounts (Batch ${batch + 1}/100)`);

        // Insert account names as properties
        await insertAccountNameProperties(insertedAccounts);

        // Generate and insert account properties
        await insertAccountProperties(insertedAccounts, propertyMetadata);
    }

    console.log('All Account Properties Inserted');
};

// Helper functions
const generateAccountData = (count: number) => [...Array(count)].map(() => ({
    recordType: recordTypeEnumValues[0],
    createdAt: new Date(faker.date.past()),
    updatedAt: new Date(faker.date.recent()),
}));

const insertAccountNameProperties = async (accounts: any[]) => {
    const accountNameProperties = accounts.map(account => ({
        recordId: account.id,
        key: 'name',
        textValue: faker.company.name(),
        source: 'salesforce',
        propertyType: propertyTypeEnumValues[0],
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
    }));

    await db.insert(properties).values(accountNameProperties);
    console.log(`Inserted ${accountNameProperties.length} Account Name Properties`);
};

const generatePropertyMetadata = (propertyTypes: any[]) => {
    // Generate unique keys for property metadata
    const generateKey = (type: string, index: number) => {
        const baseKey = (() => {
            switch (type) {
                case 'text':
                    return faker.helpers.arrayElement(['industry', 'description', 'website', 'status']);
                case 'number':
                    return faker.helpers.arrayElement(['employee_count', 'annual_revenue', 'customer_count', 'satisfaction_score']);
                case 'boolean':
                    return faker.helpers.arrayElement(['is_active', 'is_public', 'has_partnership', 'is_fortune500']);
                case 'date':
                    return faker.helpers.arrayElement(['founded_date', 'last_contact_date', 'renewal_date', 'last_purchase_date']);
            }
        })();
        return `${baseKey}_${index}`;
    };

    return propertyTypes.flatMap((type, typeIndex) => 
        [...Array(250)].map((_, index) => ({
            type,
            key: generateKey(type, typeIndex * 250 + index),
        }))
    );
};

const insertAccountProperties = async (accounts: any[], propertyMetadata: any[]) => {
    const accountPropertyData = accounts.flatMap(account => {
        const selectedProperties = sampleSize(propertyMetadata, 900);
        return selectedProperties.map(property => {
            let value;
            switch (property.type) {
                case 'text':
                    value = faker.lorem.word();
                    break;
                case 'number':
                    value = faker.number.int({ min: 0, max: 1000000 });
                    break;
                case 'boolean':
                    value = faker.datatype.boolean();
                    break;
                case 'date':
                    value = new Date(faker.date.past().toISOString());
                    break;
            }
            return {
                recordId: account.id,
                propertyType: property.type,
                key: property.key,
                source: 'salesforce',
                [property.type === 'text' ? 'textValue' : property.type + 'Value']: value,
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
            };
        });
    });

    await Promise.all(
        chunk(accountPropertyData, 1000).map(async (data) => await db.insert(properties).values(data))
    );
};

const seed = async () => {
    const userData = [...Array.from(Array(10000).keys())].map(i => {
        faker.seed(i);
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return {
            email: faker.internet.email({ firstName, lastName }),
            firstName,
            lastName,
            phoneNumber: faker.phone.number(),
            image: faker.image.avatar(),
        };
    });

    console.log(userData.length);

    await db.delete(users);

    const insertedUsers = await db.insert(users).values(uniqBy(userData, 'email')).returning({ id: users.id });;
    console.log(`Inserted ${insertedUsers.length} Users`);

    const generateEventType = (index: number) => eventTypeEnumValues[index % 6];
    const generateEvents = (user: { id: number }, count: number) => [...Array.from(Array(count).keys())].map((_, index) => {
        faker.seed(index);
        return {
            userId: user.id,
            content: faker.word.words({ count: getRandomInt(10) }),
            eventType: generateEventType(index),
            url: faker.internet.url(),
        };
    })

    const eventData = insertedUsers.flatMap(user => generateEvents(user, getRandomInt(50)));
    console.log(eventData.length);
    console.log(eventData[0]);
    await db.delete(events);
    await Promise.all(
        chunk(eventData, 10000).map(async (data) => await db.insert(events).values(data))
    )
    console.log('Events Inserted');
    return;
}

// seed();
// seedAccounts();