import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("password123", 12);

  const coachUser = await prisma.user.upsert({
    where: { email: "coach@example.com" },
    update: { emailVerified: new Date() },
    create: {
      email: "coach@example.com",
      passwordHash,
      name: "Jake Thompson",
      role: "COACH",
      emailVerified: new Date(),
    },
  });

  const coachProfile = await prisma.coachProfile.upsert({
    where: { userId: coachUser.id },
    update: { coachRole: "HEAD_COACH" },
    create: {
      userId: coachUser.id,
      coachRole: "HEAD_COACH",
      title: "Head Coach",
      team: "Vegas Golden Knights",
      league: "Elite League",
      level: "Pro",
      birthYear: 1990,
      location: "Las Vegas, NV",
      about:
        "Dedicated hockey coach with a passion for developing players both on and off the ice.",
      philosophy:
        "My coaching philosophy is centered on discipline, teamwork, and continuous improvement.",
      phone: "+1 (702) 555-0123",
    },
  });

  await prisma.coachCertification.createMany({
    data: [
      { coachId: coachProfile.id, name: "CEP Level 5", number: "#123467940" },
      {
        coachId: coachProfile.id,
        name: "USA Hockey Coaching Certification",
        number: "#USA-HC-2023",
      },
    ],
  });

  await prisma.coachExperience.createMany({
    data: [
      {
        coachId: coachProfile.id,
        title: "Head Coach",
        team: "Vegas Golden Knights",
        years: "2020 - Present",
        description: "Leading the professional team",
      },
    ],
  });

  await prisma.coachSpecialty.createMany({
    data: [
      { coachId: coachProfile.id, name: "Offensive Strategy" },
      { coachId: coachProfile.id, name: "Player Development" },
    ],
  });

  // Parent account for testing sign-in
  const parentUser = await prisma.user.upsert({
    where: { email: "parent@example.com" },
    update: { emailVerified: new Date() },
    create: {
      email: "parent@example.com",
      passwordHash,
      name: "Test Parent",
      role: "PARENT",
      emailVerified: new Date(),
    },
  });

  const parentProfile = await prisma.parentProfile.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
      phone: "+15551234567",
    },
  });

  // Gold test account – for testing Gold plan features (contact requests, facility reviews, etc.)
  const goldUser = await prisma.user.upsert({
    where: { email: "gold-test@example.com" },
    update: { emailVerified: new Date() },
    create: {
      email: "gold-test@example.com",
      passwordHash,
      name: "Gold Test Parent",
      role: "PARENT",
      emailVerified: new Date(),
    },
  });

  const goldProfile = await prisma.parentProfile.upsert({
    where: { userId: goldUser.id },
    update: {
      planId: "gold",
      subscriptionStatus: "active",
      subscriptionPeriodEndAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
    create: {
      userId: goldUser.id,
      phone: "+15551234568",
      planId: "gold",
      subscriptionStatus: "active",
      subscriptionPeriodEndAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.player.upsert({
    where: { id: "seed-player-gold" },
    update: {},
    create: {
      id: "seed-player-gold",
      parentId: goldProfile.id,
      name: "Alex Gold",
      birthYear: 2011,
      position: "Forward",
      level: "AA",
      team: "Gold Eagles",
      status: "Verified",
    },
  });

  // Elite test account – for testing Elite plan features (coach ratings, evaluations, full name, etc.)
  const eliteUser = await prisma.user.upsert({
    where: { email: "elite-test@example.com" },
    update: { emailVerified: new Date() },
    create: {
      email: "elite-test@example.com",
      passwordHash,
      name: "Elite Test Parent",
      role: "PARENT",
      emailVerified: new Date(),
    },
  });

  const eliteProfile = await prisma.parentProfile.upsert({
    where: { userId: eliteUser.id },
    update: {
      planId: "elite",
      subscriptionStatus: "active",
      subscriptionPeriodEndAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    create: {
      userId: eliteUser.id,
      phone: "+15551234569",
      planId: "elite",
      subscriptionStatus: "active",
      subscriptionPeriodEndAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.player.upsert({
    where: { id: "seed-player-elite" },
    update: {},
    create: {
      id: "seed-player-elite",
      parentId: eliteProfile.id,
      name: "Sam Elite",
      birthYear: 2010,
      position: "Defense",
      level: "AAA",
      team: "Elite Hawks",
      status: "Verified",
    },
  });

  // Seed events for development (always use future dates so they appear in the app)
  const base = new Date();
  const event1Start = new Date(base);
  event1Start.setDate(event1Start.getDate() + 7);
  event1Start.setHours(18, 0, 0, 0);
  const event1End = new Date(event1Start);
  event1End.setHours(20, 0, 0, 0);

  const event2Start = new Date(base);
  event2Start.setDate(event2Start.getDate() + 14);
  event2Start.setHours(10, 0, 0, 0);
  const event2End = new Date(event2Start);
  event2End.setHours(14, 0, 0, 0);

  const event3Start = new Date(base);
  event3Start.setDate(event3Start.getDate() + 30);
  event3Start.setHours(14, 0, 0, 0);
  const event3End = new Date(event3Start);
  event3End.setHours(16, 0, 0, 0);

  await prisma.event.upsert({
    where: { id: "seed-event-1" },
    update: { startAt: event1Start, endAt: event1End, eventType: "Tournament" },
    create: {
      id: "seed-event-1",
      coachId: coachProfile.id,
      title: "AAA Tryouts - 2012 Birth Year",
      description: "Open tryouts for the 2012 birth year AAA team.",
      location: "1200 Ice Rink Blvd, Chicago, IL 60601, USA",
      startAt: event1Start,
      endAt: event1End,
      eventType: "Tournament",
    },
  });

  await prisma.event.upsert({
    where: { id: "seed-event-2" },
    update: { startAt: event2Start, endAt: event2End, eventType: "Camp" },
    create: {
      id: "seed-event-2",
      coachId: coachProfile.id,
      title: "Skills Development Camp",
      description: "Multi-day skills clinic.",
      location: "500 Arena Way, Chicago, IL 60602, USA",
      startAt: event2Start,
      endAt: event2End,
      eventType: "Camp",
    },
  });

  // RSVP test event – use this to test the Going/Upcoming Events workflow
  await prisma.event.upsert({
    where: { id: "seed-event-rsvp-test" },
    update: { startAt: event3Start, endAt: event3End },
    create: {
      id: "seed-event-rsvp-test",
      coachId: coachProfile.id,
      title: "RSVP Test Event – Tryouts & Clinic",
      description: "Use this event to test the RSVP flow: click Going, select a player, then check the dashboard.",
      location: "100 Test Rink Dr, Chicago, IL 60601, USA",
      startAt: event3Start,
      endAt: event3End,
    },
  });

  // Test player for parent (required to use the Going/RSVP flow)
  await prisma.player.upsert({
    where: { id: "seed-player-test" },
    update: {},
    create: {
      id: "seed-player-test",
      parentId: parentProfile.id,
      name: "Jake",
      birthYear: 2012,
      position: "Forward",
      level: "AAA",
      team: "Test Eagles",
      status: "Verified",
    },
  });

  // Admin account for admin portal
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: "ADMIN", passwordHash, emailVerified: new Date() },
    create: {
      email: "admin@example.com",
      passwordHash,
      name: "Admin User",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Seed static facilities (from facilitiesData) as approved so admin can manage all from one place
  const staticFacilities = [
    {
      slug: "arctic-ice-arena",
      facilityName: "Arctic Ice Arena",
      address: "12000 Portland Ave S",
      city: "Minneapolis",
      zipCode: "55337",
      phone: "(612) 555-0123",
      website: null as string | null,
      description:
        "Premier ice skating facility featuring two NHL-sized rinks, perfect for hockey leagues, figure skating, and public skating.",
      amenities: ["Real Ice", "Skating (Edgework)", "Skating (Power)", "Shooting Skills", "Stick Handling", "Goalie Training"],
      hours: "Mon–Sun · 6:00 AM – 11:00 PM",
      imageUrl: "/newasset/facilities/card/arctic-arena-1.png",
      lat: 44.7227,
      lng: -93.3897,
      facilityType: "in-person" as const,
    },
    {
      slug: "champions-sports-complex",
      facilityName: "Champions Sports Complex",
      address: "5750 Cowboys Pkwy",
      city: "Frisco",
      zipCode: "75034",
      phone: "(972) 555-0456",
      website: null as string | null,
      description:
        "Multi-sport complex with ice rinks, synthetic ice, and extensive training amenities for hockey and other sports.",
      amenities: ["Real Ice", "Synthetic Ice", "Shooting Skills", "Skating (Edgework)", "Skating (Power)", "Stick Handling", "Goalie Training"],
      hours: "Mon–Sun · 5:00 AM – 11:00 PM",
      imageUrl: "/newasset/facilities/card/Elite-Training-Hub -1.png",
      lat: 33.1507,
      lng: -96.8236,
      facilityType: "tournament-teams" as const,
    },
    {
      slug: "glacial-gardens",
      facilityName: "Glacial Gardens",
      address: "7900 Xerxes Ave S",
      city: "Bloomington",
      zipCode: "55431",
      phone: "(952) 555-0789",
      website: null as string | null,
      description:
        "Community ice rink with excellent skating conditions and training programs.",
      amenities: ["Real Ice", "Skating (Edgework)", "Skating (Power)"],
      hours: "Mon–Fri 6 AM – 10 PM · Sat–Sun 7 AM – 9 PM",
      imageUrl: "/newasset/facilities/card/skydiving-wsc.jpg",
      lat: 44.8483,
      lng: -93.3036,
      facilityType: "in-person" as const,
    },
    {
      slug: "elite-training-hub",
      facilityName: "Elite Training Hub",
      address: "5701 Normandale Rd",
      city: "Edina",
      zipCode: "55424",
      phone: "(952) 555-0321",
      website: null as string | null,
      description:
        "State-of-the-art dryland and synthetic ice training facility for hockey development.",
      amenities: ["Synthetic Ice", "Shooting Skills", "Skating (Power)", "Stick Handling"],
      hours: "Mon–Sun · 5:00 AM – 10:00 PM",
      imageUrl: "/newasset/facilities/card/arctic-arena-1.png",
      lat: 44.8897,
      lng: -93.3499,
      facilityType: "at-home-trainer" as const,
    },
  ];

  for (const f of staticFacilities) {
    await prisma.facilitySubmission.upsert({
      where: { slug: f.slug },
      create: {
        facilityName: f.facilityName,
        address: f.address,
        city: f.city,
        zipCode: f.zipCode,
        phone: f.phone,
        website: f.website,
        description: f.description,
        amenities: f.amenities,
        hours: f.hours,
        imageUrl: f.imageUrl,
        lat: f.lat,
        lng: f.lng,
        facilityType: f.facilityType,
        status: "approved",
        slug: f.slug,
      },
      update: {
        facilityName: f.facilityName,
        address: f.address,
        city: f.city,
        zipCode: f.zipCode,
        phone: f.phone,
        website: f.website,
        description: f.description,
        amenities: f.amenities,
        hours: f.hours,
        imageUrl: f.imageUrl,
        lat: f.lat,
        lng: f.lng,
        facilityType: f.facilityType,
        status: "approved",
      },
    });
  }

  // Demo blog posts for development
  const blogPosts = [
    {
      id: "seed-blog-1",
      title: "Welcome to Youth Hockey: A New Parent Guide",
      content:
        "Starting out in youth hockey can feel overwhelming. This guide covers the basics: what gear your child needs, how tryouts work, and what to expect in your first season. We'll walk you through registration, team selection, and tips for making the most of the experience.",
      imageUrl: null,
      author: "My Hockey Recruiting",
      category: "New Parent Guide",
      featured: true,
      publishedAt: new Date("2025-02-15"),
    },
    {
      id: "seed-blog-2",
      title: "5 Drills to Boost Your Skating Power",
      content:
        "Skating power translates directly to game speed. Whether you're working on acceleration or top-end speed, these five drills will help build leg strength and explosive edge work. Perfect for players at any level looking to improve their stride.",
      imageUrl: null,
      author: "Coach Sarah Mitchell",
      category: "Player Development",
      featured: false,
      publishedAt: new Date("2025-02-10"),
    },
    {
      id: "seed-blog-3",
      title: "Understanding AAA vs AA: Pathways Explained",
      content:
        "The difference between AAA, AA, and other tiers can be confusing for families new to competitive hockey. This post breaks down how teams are structured, what tryouts look like at each level, and how players can progress through the system.",
      imageUrl: null,
      author: "My Hockey Recruiting",
      category: "Teams, Tryouts & Pathways",
      featured: false,
      publishedAt: new Date("2025-02-05"),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      create: post,
      update: {
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        author: post.author,
        category: post.category,
        featured: post.featured,
        publishedAt: post.publishedAt,
      },
    });
  }

  // League, Level, Team (flat lists in LookupValue)
  const { LEAGUES, LEVELS, TEAMS } = await import("./league-data");
  for (let i = 0; i < LEAGUES.length; i++) {
    await prisma.lookupValue.upsert({
      where: { category_value: { category: "league", value: LEAGUES[i] } },
      create: { category: "league", value: LEAGUES[i], sortOrder: i },
      update: { sortOrder: i },
    });
  }
  for (let i = 0; i < LEVELS.length; i++) {
    await prisma.lookupValue.upsert({
      where: { category_value: { category: "level", value: LEVELS[i] } },
      create: { category: "level", value: LEVELS[i], sortOrder: i },
      update: { sortOrder: i },
    });
  }
  for (let i = 0; i < Math.min(50, TEAMS.length); i++) {
    await prisma.lookupValue.upsert({
      where: { category_value: { category: "team", value: TEAMS[i] } },
      create: { category: "team", value: TEAMS[i], sortOrder: i },
      update: { sortOrder: i },
    });
  }

  // Flat lookups
  const { BIRTH_YEARS, AREAS } = await import("./league-data");
  const lookups = [
    ...BIRTH_YEARS.map((value, i) => ({
      category: "birth_year" as const,
      value,
      sortOrder: i,
    })),
    ...AREAS.map((value, i) => ({
      category: "area" as const,
      value,
      sortOrder: i,
    })),
    // Coach defaults (not in league CSV)
    ...["Head Coach", "Assistant Coach"].map((value, i) => ({
      category: "coach_title" as const,
      value,
      sortOrder: i,
    })),
    ...[
      "Skill Development", "Communication", "Player Development", "Tactical Strategy",
      "Leadership", "Game Strategy", "Skating", "Shooting", "Puck Handling",
      "Defensive Play", "Offensive Play", "Goaltending",
    ].map((value, i) => ({
      category: "coach_specialty" as const,
      value,
      sortOrder: i,
    })),
  ];
  for (const l of lookups) {
    await prisma.lookupValue.upsert({
      where: {
        category_value: { category: l.category, value: l.value },
      },
      create: l,
      update: { sortOrder: l.sortOrder },
    });
  }

  // Demo school for Teams and Schools page
  await prisma.schoolSubmission.upsert({
    where: { id: "seed-school-1" },
    create: {
      id: "seed-school-1",
      name: "NE Knights AAA",
      address: "123 Rink Road",
      city: "Boston",
      zipCode: "02101",
      description: "A premier AAA hockey program serving youth players in the Northeast. Top-tier coaching and development.",
      status: "approved",
      slug: "ne-knights-aaa",
      gender: ["Male"],
      league: ["E9 Boys", "EHF"],
      ageBracketFrom: "U10",
      ageBracketTo: "U18",
    },
    update: { name: "NE Knights AAA", status: "approved", slug: "ne-knights-aaa", gender: ["Male"], league: ["E9 Boys", "EHF"], ageBracketFrom: "U10", ageBracketTo: "U18" },
  });

  console.log("Seed complete!");
  console.log("  Admin: admin@example.com / password123");
  console.log("  Coach: coach@example.com / password123");
  console.log("  Parent: parent@example.com / password123");
  console.log("  Gold (parent): gold-test@example.com / password123");
  console.log("  Elite (parent): elite-test@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
