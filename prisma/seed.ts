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
      backgroundImage: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2000&auto=format&fit=crop", 
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

  // SEED PUBLISHED BLOG POSTS
  await prisma.blogPost.createMany({
    data: [
      {
        title: "Why the Falcon 900EX is the Ultimate Business Jet",
        slug: "why-falcon-900ex-ultimate-business-jet",
        category: "Industry",
        excerpt: "Discover why the Dassault Falcon 900EX remains the gold standard for ultra-long-range private aviation.",
        content: "<h2>A Legacy of Excellence</h2><p>The Dassault Falcon 900EX is renowned for its tri-jet engine setup, offering unparalleled safety over oceans. <strong>Comfort and performance</strong> intersect perfectly in this legendary aircraft.</p><p>With a multi-zone cabin, executives can conduct meetings in the forward section while others rest in the aft stateroom.</p>",
        thumbnail: "https://images.unsplash.com/photo-1540962351504-03099e0a754b",
        published: true,
        author: "Capt. Sylvester Moni",
        readTime: "5 min read"
      },
      {
        title: "The Future of Private Aviation: Trends Shaping 2026",
        slug: "future-of-private-aviation",
        category: "Industry",
        excerpt: "From sustainable aviation fuel to AI-powered operations, the landscape of private aviation is evolving rapidly.",
        content: "<h2>A Tectonic Shift</h2><p>The landscape of private aviation is undergoing a tectonic shift. As we navigate through 2026, the industry is no longer just about speed and luxury; it is about intelligence, sustainability, and seamless integration.</p><h2>The Green Revolution</h2><p>The push for net-zero emissions has accelerated the adoption of Sustainable Aviation Fuel (SAF). Leading operators are now committing to 100% SAF blends, significantly reducing the carbon footprint of transcontinental travel.</p>",
        thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
        published: true,
        author: "Jameson Wright",
        readTime: "8 min read"
      },
      {
        title: "Choosing the Right Aircraft: A Buyer's Guide",
        slug: "choosing-right-aircraft",
        category: "Industry",
        excerpt: "Key considerations when selecting your first or next business aircraft to match your operational profile.",
        content: "<h2>Define Your Mission</h2><p>Acquiring an aircraft is a monumental decision. Understanding your primary mission profile is essential. If 90% of your flights are domestic, over-investing in an ultra-long-range jet may lead to unnecessary overhead.</p><h2>Cabin Comfort</h2><p>Modern buyers are prioritizing low cabin altitude systems—which reduce fatigue—and high-speed Ka-band connectivity to ensure productivity never halts.</p>",
        thumbnail: "https://images.unsplash.com/photo-1517976487492-5750f3195933",
        published: true,
        author: "Elena Rossi",
        readTime: "10 min read"
      },
      {
        title: "Mastering International Trip Planning",
        slug: "international-trip-planning",
        category: "Operations",
        excerpt: "Behind the scenes of a complex international mission: permits, slots, and VIP ground handling.",
        content: "<h2>The Global Chessboard</h2><p>Crossing borders in a private jet involves a sophisticated choreography of permits, slots, and ground handling arrangements. A single oversight can ground a multi-million dollar operation.</p><h2>Beyond the Tarmac</h2><p>The mission doesn't end on the tarmac. Executive protection, secure transport, and catering must be synced perfectly with the aircraft's arrival.</p>",
        thumbnail: "https://images.unsplash.com/photo-1583416750470-965b2707b355",
        published: true,
        author: "Capt. Marcus Chen",
        readTime: "7 min read"
      },
      {
        title: "Understanding Aircraft Maintenance Checks (A, B, C, D)",
        slug: "understanding-aircraft-maintenance",
        category: "Operations",
        excerpt: "A comprehensive breakdown of routine aircraft maintenance and why it is critical for asset protection.",
        content: "<h2>Safety Without Compromise</h2><p>Routine maintenance is the backbone of aviation safety. Operators must adhere to strict schedules known as A, B, C, and D checks to maintain airworthiness.</p><h2>Protecting Your Investment</h2><p>Skipping or delaying maintenance not only risks safety but drastically reduces the residual value of the aircraft on the secondary market.</p>",
        thumbnail: "https://images.unsplash.com/photo-1508216333917-2ba028cc7a95",
        published: true,
        author: "David Lawson",
        readTime: "6 min read"
      },
      {
        title: "Maximizing ROI with Empty Leg Charters",
        slug: "empty-leg-charters-roi",
        category: "Operations",
        excerpt: "How aircraft owners can offset operational costs by capitalizing on repositioning flights.",
        content: "<h2>What is an Empty Leg?</h2><p>An empty leg occurs when an aircraft needs to reposition for its next booked flight without any passengers on board. For owners, this is an opportunity to recoup costs.</p><h2>The Market Demand</h2><p>Savvy charter clients actively seek out these empty legs for significant discounts, creating a win-win scenario for both the operator and the consumer.</p>",
        thumbnail: "https://images.unsplash.com/photo-1569154941061-e231b4732600",
        published: true,
        author: "Sarah Jenkins",
        readTime: "4 min read"
      }
    ]
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