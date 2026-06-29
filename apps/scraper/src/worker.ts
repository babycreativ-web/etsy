import { Worker, Job } from 'bullmq';
import { prisma } from '@etsy/database';
import { scrapeShop } from './scrapers/shop';
import { scrapeListing } from './scrapers/listing';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

export const worker = new Worker(
  'etsy-scraping-queue',
  async (job: Job) => {
    console.log(`[Scraper] Processing job ${job.id} for target: ${job.data.targetId}`);
    
    // Update job status in database to PROCESSING
    if (job.data.dbJobId) {
      await prisma.scraperJob.update({
        where: { id: job.data.dbJobId },
        data: {
          status: 'PROCESSING',
          startedAt: new Date(),
        },
      });
    }

    try {
      if (job.name === 'SHOP_SCRAPE') {
        await scrapeShop(job.data.targetId);
      } else if (job.name === 'LISTING_SCRAPE') {
        await scrapeListing(job.data.targetId);
      } else {
        throw new Error(`Unknown job type: ${job.name}`);
      }

      // Update job status to COMPLETED
      if (job.data.dbJobId) {
        await prisma.scraperJob.update({
          where: { id: job.data.dbJobId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        });
      }
    } catch (error: any) {
      console.error(`[Scraper] Error running job ${job.id}:`, error);

      // Update job status to FAILED
      if (job.data.dbJobId) {
        await prisma.scraperJob.update({
          where: { id: job.data.dbJobId },
          data: {
            status: 'FAILED',
            errorMessage: error.message || String(error),
            retries: { increment: 1 },
          },
        });
      }

      throw error;
    }
  },
  {
    connection: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
    concurrency: 2,
  }
);
