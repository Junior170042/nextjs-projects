import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const globalForDb = globalThis as unknown as {
    sql: ReturnType<typeof neon> | undefined;
};

const sql = globalForDb.sql ?? neon(process.env.DATABASE_URL!);

if (process.env.ENVIREMENT !== 'production') globalForDb.sql = sql;

// ⚡ Drizzle usando HTTP: no necesita cerrar conexiones
export const db = drizzle({ client: sql });


