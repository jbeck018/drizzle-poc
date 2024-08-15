import { faker } from "@faker-js/faker";
import { db } from '../index'
import { chunk, uniqBy } from "lodash";
import { users, events, eventTypeEnumValues } from "../schema";

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

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

seed();