import { worker } from './worker';
import dotenv from 'dotenv';
import { scrapeShop } from './scrapers/shop';
import { scrapeListing } from './scrapers/listing';

dotenv.config();

const args = process.argv.slice(2);

if (args.includes('--shop')) {
  const shopNameIdx = args.indexOf('--shop') + 1;
  const shopName = args[shopNameIdx];
  if (shopName) {
    console.log(`[Scraper] CLI Trigger: Scraping shop "${shopName}"...`);
    scrapeShop(shopName)
      .then(() => {
        console.log(`[Scraper] Shop "${shopName}" scraped successfully!`);
        process.exit(0);
      })
      .catch((err) => {
        console.error(`[Scraper] Shop scrape failed:`, err);
        process.exit(1);
      });
  }
} else if (args.includes('--listing')) {
  const listingIdIdx = args.indexOf('--listing') + 1;
  const listingId = args[listingIdIdx];
  if (listingId) {
    console.log(`[Scraper] CLI Trigger: Scraping listing ID "${listingId}"...`);
    scrapeListing(listingId)
      .then(() => {
        console.log(`[Scraper] Listing scraped successfully!`);
        process.exit(0);
      })
      .catch((err) => {
        console.error(`[Scraper] Listing scrape failed:`, err);
        process.exit(1);
      });
  }
} else {
  const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

  console.log(`[Scraper] Starting Worker node connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

  worker.on('completed', (job) => {
    console.log(`[Scraper] Job ${job.id} (type: ${job.name}) completed successfully.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Scraper] Job ${job?.id} (type: ${job?.name}) failed: ${err.message}`);
  });
}
