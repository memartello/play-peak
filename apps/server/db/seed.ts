import * as db_schemas from './schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const seed_sports = [
  {
    id: 1,
    name: 'Football',
  },
  {
    id: 2,
    name: 'Basketball',
  },
  {
    id: 3,
    name: 'Paddle',
  },
  {
    id: 4,
    name: 'Tennis',
  },
];

const seed_categories = [
  {
    sport: 'Football',
    name: '5v5',
    teamSize: 5,
    totalPlayers: 10,
  },
  {
    sport: 'Football',
    name: '7v7',
    teamSize: 7,
    totalPlayers: 14,
  },
  {
    sport: 'Football',
    name: '11v11',
    teamSize: 11,
    totalPlayers: 22,
  },
  {
    sport: 'Basketball',
    name: '3v3',
    teamSize: 3,
    totalPlayers: 6,
  },
  {
    sport: 'Basketball',
    name: '5v5',
    teamSize: 5,
    totalPlayers: 10,
  },
  {
    sport: 'Paddle',
    name: 'Doubles',
    teamSize: 2,
    totalPlayers: 4,
  },
  {
    sport: 'Tennis',
    name: 'Singles',
    teamSize: 1,
    totalPlayers: 2,
  },
  {
    sport: 'Tennis',
    name: 'Doubles',
    teamSize: 2,
    totalPlayers: 4,
  },
];

if (!('DATABASE_URL' in process.env))
  throw new Error('DATABASE_URL not found on .env file');

const executeSeed = async () => {
  console.log('Starting seed');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const db = drizzle(client, { schema: { ...db_schemas } });

  const sports: (typeof db_schemas.sport.$inferInsert)[] = [];
  const sportModes: (typeof db_schemas.sportMode.$inferInsert)[] = [];

  if (!db) {
    throw new Error('DB not found');
  }

  if ((await db.query.sport.findMany()).length === 0) {
    console.log('Sport Seed start');
    for (let i = 0; i < seed_sports.length; i++) {
      sports.push({
        name: seed_sports[i].name,
      });
    }

    await db.insert(db_schemas.sport).values(sports);
    console.log('Sport Seed done');
  }

  const results = await db.query.sport.findMany();

  if ((await db.query.sportMode.findMany()).length === 0) {
    for (let i = 0; i < seed_categories.length; i++) {
      const dbSport = results.find(
        (sport) => sport.name === seed_categories[i].sport,
      );

      if (!dbSport) throw new Error('Sport not found');

      sportModes.push({
        sportId: dbSport['id'] as string,
        name: seed_categories[i].name,
        teamSize: seed_categories[i].teamSize,
      });
    }
    await db.insert(db_schemas.sportMode).values(sportModes);
  }

  await client.end();
};

executeSeed();

export default executeSeed;
