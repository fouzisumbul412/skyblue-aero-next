import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { chartersSeedData, falconSeedData } from './seed-data/charters';
import { contractFuelSeedData } from './seed-data/contract-fuel';
import { tripSupportSeedData } from './seed-data/trip-support';
import { brokerageSeedData } from './seed-data/brokerage';
import { maintenanceSeedData } from './seed-data/maintenance';
import { crewLeasingSeedData } from './seed-data/crew-leasing';
import { aboutSeedData } from './seed-data/about';
import { homeServicesSeedData } from './seed-data/home-services';

async function main() {
  console.log("🧹 Sweeping target database tables clean...");
  
  await prisma.dynamicPage.deleteMany();
  await prisma.homeServicesConfig.deleteMany();
  await prisma.homeFalconSection.deleteMany();

  console.log("🌱 Target tables are empty. Seeding new data...");

  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  // SEED HOME FALCON SECTION
  await prisma.homeFalconSection.create({
    data: {
      title: falconSeedData.title,
      planeModel: falconSeedData.planeModel,
      subtitle: falconSeedData.subtitle,
      description: falconSeedData.description,
      backgroundImage: falconSeedData.backgroundImage, 
      leftGridTitle: falconSeedData.leftGridTitle,
      rightGridTitle: falconSeedData.rightGridTitle,
      gridItems: {
        create: [
          ...falconSeedData.leftItems,
          ...falconSeedData.rightItems
        ]
      }
    }
  });

  // SEED HOME SERVICES 
  await prisma.homeServicesConfig.create({
    data: {
      title: homeServicesSeedData.title,
      cards: {
        create: homeServicesSeedData.cards
      }
    }
  });

  // SEED DYNAMIC PAGES
  const allDynamicPages = [
    aboutSeedData,
    chartersSeedData,
    contractFuelSeedData,
    tripSupportSeedData,
    brokerageSeedData,
    maintenanceSeedData,
    crewLeasingSeedData
  ];

  for (const page of allDynamicPages) {
    await prisma.dynamicPage.create({
      data: {
        slug: page.slug,
        heroTitle: page.heroTitle,
        heroSubtitle: page.heroSubtitle,
        heroDesc: page.heroDesc,
        heroImage: page.heroImage,
        sections: {
          create: page.sections.map((section: any) => ({
            type: section.type,
            order: section.order,
            title: section.title,
            subtitle: section.subtitle,
            description: section.description,
            image: section.image,
            badgeIcon: section.badgeIcon,
            badgeTitle: section.badgeTitle,
            badgeDesc: section.badgeDesc,
            buttonText: section.buttonText,
            buttonLink: section.buttonLink,
            tags: section.tags || undefined,
            items: {
              create: section.items?.map((item: any) => ({
                order: item.order,
                title: item.title,
                subtitle: item.subtitle,
                description: item.description,
                icon: item.icon,
                image: item.image,
                bullets: item.bullets || undefined,
                extraData: typeof item.extraData === 'string' ? JSON.parse(item.extraData) : item.extraData
              })) || []
            }
          }))
        }
      }
    });
    console.log(`✅ Dynamic Page seeded: /${page.slug}`);
  }

  console.log("🚀 All seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });