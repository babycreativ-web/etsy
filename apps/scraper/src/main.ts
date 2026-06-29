import { worker } from './worker';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

console.log(`[Scraper] Starting Worker node connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

worker.on('completed', (job) => {
  console.log(`[Scraper] Job ${job.id} (type: ${job.name}) completed successfully.`);
});

worker.on('failed', (job, err) => {
  console.error(`[Scraper] Job ${job?.id} (type: ${job?.name}) failed: ${err.message}`);
});
