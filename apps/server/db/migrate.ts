import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

const executeMigrations = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const db = drizzle(client);
  console.log('Migrating database...');

  await migrate(db, { migrationsFolder: './drizzle' });

  console.log('Database migrated successfully');

  await client.end();
};

executeMigrations();

export default executeMigrations;
