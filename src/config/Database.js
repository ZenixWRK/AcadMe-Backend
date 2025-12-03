import {neon} from '@neondatabase/serverless';
import 'dotenv/config';

const dbUrl = process.env.DB_URL;

export const sql = neon(dbUrl);

export async function initDB() {
    // Database initialization logic can go here

    try {
        await sql`CREATE TABLE IF NOT EXISTS assignments(
            id SERIAL PRIMARY KEY,
            userId VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            dueDate DATE NOT NULL,
            subject VARCHAR(255) NOT NULL,
            priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
            completed BOOLEAN DEFAULT false,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
        console.log('Database initialized successfully');

        // DECIMAL(10,2) means there can be a max of 10 digits, 2 of which are after the decimal point (e.g., 12345678.90 => 10 digits total, 2 after decimal)
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1); // Code 1 indicates failure - 0 indicates success
    }
}
