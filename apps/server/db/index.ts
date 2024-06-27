import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as db_schemas from './schema';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();
const db = drizzle(client, { schema: { ...db_schemas } });

export default db;
