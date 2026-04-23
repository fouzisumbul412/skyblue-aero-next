import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs'; 

async function main() {
  console.log("🧹 Sweeping the database clean...");
  
  await prisma.quoteRequest.deleteMany();
  await prisma.charterRequest.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.aboutPage.deleteMany();
  await prisma.homeServicesConfig.deleteMany();
  await prisma.homeFalconSection.deleteMany();
  await prisma.user.deleteMany();
  await prisma.zohoAuth.deleteMany();

  console.log("🌱 Database is empty. Seeding new data...");

  // SEED HOME FALCON SECTION
  await prisma.homeFalconSection.create({
    data: {
      title: "DASSAULT FALCON",
      planeModel: "900EX",
      subtitle: "ULTRA LONG RANGE JET",
      description: "Engineered for performance and comfort, this tri-jet aircraft offers multi-zone cabin configurations, ensuring a refined long-haul experience for up to 14 passengers.",
      backgroundImage: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2000&auto=format&fit=crop", // Placeholder image
      leftGridTitle: "SPECIFICATIONS",
      rightGridTitle: "OPERATIONAL DATA",
      gridItems: {
        create: [
          { side: "LEFT", label: "Charter Focus", value: "Long-Range", order: 1 },
          { side: "LEFT", label: "Cabin", value: "Multi-Zone", order: 2 },
          { side: "LEFT", label: "Range", value: "4,500 NM", order: 3 },
          { side: "RIGHT", label: "Charter Authority", value: "DGCA NSOP", order: 1 },
          { side: "RIGHT", label: "Primary Operator", value: "SKYBLUE AERO", order: 2 },
          { side: "RIGHT", label: "Aircraft ID", value: "VT-CLF", order: 3 },
        ]
      }
    }
  });

  // SEED HOME SERVICES (BENTO GRID)
  await prisma.homeServicesConfig.create({
    data: {
      title: "AVIATION SOLUTIONS, PRECISELY TAILORED TO EVERY JOURNEY",
      cards: {
        create: [
          { order: 0, title: "Trip Support", description: "Comprehensive global trip support covering permits, fuel coordination, and logistics." },
          { order: 1, title: "Air Charters", description: "Charter private aircraft on demand with access to a worldwide fleet." },
          { order: 2, title: "Aircraft Brokerage", description: "Specialized aircraft brokerage for acquisition, sale, and leasing." },
          { order: 3, title: "Aircraft Maintenance", description: "Dependable maintenance solutions that uphold the highest standards of safety." },
          { order: 4, title: "Crew Leasing", description: "Access highly trained pilots and cabin crew for every operation." },
        ]
      }
    }
  });

  // SEED ABOUT PAGE
  await prisma.aboutPage.create({
    data: {
      heroTitle: "Built on Trust. Driven by Excellence.",
      heroSubtitle: "About Us",
      heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop", 
      title: "Our Story",
      storyHeading: "Aviation Expertise,\nDelivered with Precision.",
      content: "Founded with a singular vision, Skyblue Aero delivers aviation services that match the uncompromising standards of the clients we serve. From our DGCA NSOP charter operations to worldwide trip support, every detail is engineered for perfection.",
      image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop",
      counters: {
        create: [
          { label: "Personnel Worldwide", endValue: 4500, suffix: "+", order: 1 },
          { label: "Continents", endValue: 6, suffix: null, order: 2 },
          { label: "Aircraft Managed", endValue: 150, suffix: "+", order: 3 },
          { label: "Years Experience", endValue: 25, suffix: "+", order: 4 },
        ]
      },
      values: {
        create: [
          { title: "Safety First", description: "Every decision prioritizes safety without compromise.", order: 1 },
          { title: "Client Focus", description: "Your priorities are our priorities, 24/7.", order: 2 },
          { title: "Integrity", description: "Honest advice and transparent operations.", order: 3 },
        ]
      }
    }
  });

  // SEED GALLERY
  await prisma.galleryImage.createMany({
    data: [
      { url: "https://images.unsplash.com/photo-1540962351504-03099e0a754b", order: 0 },
      { url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05", order: 1 },
      { url: "https://images.unsplash.com/photo-1517976487492-5750f3195933", order: 2 },
      { url: "https://images.unsplash.com/photo-1583416750470-965b2707b355", order: 3 },
    ]
  });

  // SEED ONE PUBLISHED BLOG POST
  await prisma.blogPost.create({
    data: {
      title: "Why the Falcon 900EX is the Ultimate Business Jet",
      slug: "why-falcon-900ex-ultimate-business-jet",
      category: "Aviation",
      excerpt: "Discover why the Dassault Falcon 900EX remains the gold standard for ultra-long-range private aviation.",
      content: "<h2>A Legacy of Excellence</h2><p>The Dassault Falcon 900EX is renowned for its tri-jet engine setup, offering unparalleled safety over oceans...</p>",
      thumbnail: "https://images.unsplash.com/photo-1540962351504-03099e0a754b",
      published: true,
    }
  });

  // SEED ADMIN USER
  const hashedPassword = await bcrypt.hash("Aman@123", 10);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@skyblue.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });