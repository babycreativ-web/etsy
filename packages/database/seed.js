const { prisma } = require('./index.js');

async function main() {
  console.log('Seeding database...');

  // 1. Create User
  const user = await prisma.user.upsert({
    where: { email: 'admin@etsyanalyzer.com' },
    update: {},
    create: {
      email: 'admin@etsyanalyzer.com',
      name: 'System Admin',
      subscriptionTier: 'PRO',
      subscriptionActive: true,
    },
  });
  console.log(`Created user: ${user.email}`);

  // 2. Create Categories
  const categoryHome = await prisma.category.upsert({
    where: { name: 'Home Decor' },
    update: {},
    create: { name: 'Home Decor' },
  });
  const categoryDigital = await prisma.category.upsert({
    where: { name: 'Digital Art' },
    update: {},
    create: { name: 'Digital Art' },
  });

  // 3. Create Shop 1
  const shop1 = await prisma.shop.upsert({
    where: { name: 'VintageCrafts' },
    update: {},
    create: {
      id: 'shop_vintage_crafts_123',
      name: 'VintageCrafts',
      title: 'Handmade Vintage Items and Decor',
      url: 'https://www.etsy.com/shop/VintageCrafts',
      ownerName: 'Alice Miller',
      country: 'United States',
      isStarSeller: true,
      rating: 4.9,
      reviewsCount: 350,
      favoritesCount: 1540,
      salesCount: 4200,
      estimatedRevenue: 105000.0,
      activeListingsCount: 45,
      seoScore: 88.5,
      competitionScore: 65.0,
      growthScore: 78.0,
      demandScore: 82.0,
      conversionEstimate: 3.2,
    },
  });

  // 4. Create Shop 2
  const shop2 = await prisma.shop.upsert({
    where: { name: 'DigitalPrintables' },
    update: {},
    create: {
      id: 'shop_digital_printables_456',
      name: 'DigitalPrintables',
      title: 'Modern Wall Art & Planners',
      url: 'https://www.etsy.com/shop/DigitalPrintables',
      ownerName: 'Bob Smith',
      country: 'United Kingdom',
      isStarSeller: false,
      rating: 4.7,
      reviewsCount: 85,
      favoritesCount: 620,
      salesCount: 850,
      estimatedRevenue: 12750.0,
      activeListingsCount: 30,
      seoScore: 92.0,
      competitionScore: 40.0,
      growthScore: 85.0,
      demandScore: 60.0,
      conversionEstimate: 4.5,
    },
  });
  console.log('Created shops: VintageCrafts, DigitalPrintables');

  // 5. Create Shop Categories
  await prisma.shopCategory.upsert({
    where: { shopId_categoryId: { shopId: shop1.id, categoryId: categoryHome.id } },
    update: {},
    create: { shopId: shop1.id, categoryId: categoryHome.id },
  });

  // 6. Create Listing 1 for Shop 1
  const listing1 = await prisma.listing.upsert({
    where: { id: 'listing_vintage_rug_789' },
    update: {},
    create: {
      id: 'listing_vintage_rug_789',
      shopId: shop1.id,
      title: 'Handwoven Turkish Vintage Rug - 4x6 Boho Decor',
      description: 'Stunning vintage handwoven rug from central Turkey. 100% organic wool.',
      price: 249.99,
      currency: 'USD',
      url: 'https://www.etsy.com/listing/789',
      imageUrl: 'https://images.unsplash.com/photo-1543248939-ff40856f65d4',
      isDigital: false,
      isPhysical: true,
      hasFreeShipping: true,
      salesCount: 15,
      estimatedRevenue: 3749.85,
      rating: 4.8,
      reviewsCount: 4,
      favoritesCount: 95,
      tags: ['vintage rug', 'turkish rug', 'boho decor', 'handwoven'],
    },
  });

  // 7. Create Listing 2 for Shop 2
  const listing2 = await prisma.listing.upsert({
    where: { id: 'listing_digital_planner_101' },
    update: {},
    create: {
      id: 'listing_digital_planner_101',
      shopId: shop2.id,
      title: '2026 Digital Planner - Hyperlinked iPad Planner',
      description: 'Organize your entire year with this hyperlinked PDF planner.',
      price: 14.99,
      currency: 'USD',
      url: 'https://www.etsy.com/listing/101',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      isDigital: true,
      isPhysical: false,
      hasFreeShipping: true,
      salesCount: 420,
      estimatedRevenue: 6295.8,
      rating: 4.9,
      reviewsCount: 38,
      favoritesCount: 310,
      tags: ['digital planner', 'goodnotes planner', 'ipad planner', '2026 planner'],
    },
  });
  console.log('Created listings: Turkish Rug, Digital Planner');

  // 8. Create Shop Snapshots (simulate historical 7 days sales)
  for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Normalize date to day boundary for unique constraints
    date.setHours(0,0,0,0);
    
    try {
      // Shop 1 snapshots (growth simulation)
      await prisma.shopSnapshot.upsert({
        where: { shopId_date: { shopId: shop1.id, date } },
        update: {},
        create: {
          shopId: shop1.id,
          date,
          salesCount: shop1.salesCount - (i * 10),
          estimatedRevenue: shop1.estimatedRevenue - (i * 250),
          reviewsCount: shop1.reviewsCount - Math.floor(i / 2),
          favoritesCount: shop1.favoritesCount - (i * 5),
          activeListingsCount: shop1.activeListingsCount,
        },
      });

      // Listing 2 snapshots (sales growth)
      await prisma.listingSnapshot.upsert({
        where: { listingId_date: { listingId: listing2.id, date } },
        update: {},
        create: {
          listingId: listing2.id,
          date,
          price: listing2.price,
          salesCount: listing2.salesCount - (i * 5),
          estimatedRevenue: (listing2.salesCount - (i * 5)) * listing2.price,
          favoritesCount: listing2.favoritesCount - (i * 3),
          reviewsCount: listing2.reviewsCount - Math.floor(i / 3),
        },
      });
    } catch (err) {
      console.warn(`Snapshot insert warning: ${err.message}`);
    }
  }
  console.log('Created shop and listing historical snapshots.');

  // 9. Create Keywords
  await prisma.keyword.upsert({
    where: { phrase: 'digital planner' },
    update: {},
    create: {
      phrase: 'digital planner',
      searchVolume: 45000,
      competition: 85.2,
      demandScore: 90.0,
      trendScore: 12.5,
      cpc: 1.25,
    },
  });

  await prisma.keyword.upsert({
    where: { phrase: 'vintage turkish rug' },
    update: {},
    create: {
      phrase: 'vintage turkish rug',
      searchVolume: 8200,
      competition: 42.0,
      demandScore: 68.0,
      trendScore: 5.4,
      cpc: 2.10,
    },
  });
  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
