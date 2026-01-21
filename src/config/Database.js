import {neon} from '@neondatabase/serverless';
import 'dotenv/config';

const dbUrl = process.env.DB_URL;

export const sql = neon(dbUrl);

export async function initDB() {

    try {
        await sql`CREATE TABLE IF NOT EXISTS assignments(
            id SERIAL PRIMARY KEY,
            userId VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            dueDate DATE NOT NULL,
            priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
            completed BOOLEAN DEFAULT false,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
        console.log('Database initialized successfully');


    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}
