import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL as string;


if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 10,
});

export default sql;
