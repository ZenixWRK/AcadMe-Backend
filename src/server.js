import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/Database.js';
import ratelimit from './middleWare/rateLimiter.js';
import assignmentsRoute from './routes/assignmentsRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import job from './config/cron.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const port = process.env.PORT || 3000;
const app = express();

// -- Middleware -- //
app.use(cors());
app.use(express.json());
app.use(ratelimit)
// -- Middleware -- //


initDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    app.get('/api/health', (req, res) => {
        res.status(200).json({ message: 'API is healthy' });
    });

    // -- Routes -- //
    app.use("/api/assignments", assignmentsRoute);
    // -- Routes -- //
});
