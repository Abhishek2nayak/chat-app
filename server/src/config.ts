import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Determine the environment and load the corresponding .env file
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
const envPath = resolve(process.cwd(), envFile);

if (existsSync(envPath)) {
    config({ path: envPath });
} else {
    throw new Error(`Environment file ${envFile} not found`);
}

config(); // Load default .env file if exists

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
export const APP_URL = process.env.APP_URL || 'http://localhost:5173/';
