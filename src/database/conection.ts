import conexao from "knex";
import dotenv from "dotenv";
dotenv.config();

export const knex = conexao({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string, 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        ssl: { rejectUnauthorized: false },
    },
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
    },
});
