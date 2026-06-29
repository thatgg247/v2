import { PrismaClient, Plan, UserRole, Industry, CompanyStage, PortalType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Series OS 2.0 database...");

  // Demo organization
  const org = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    update: {},
    create: {
      name: "Demo Organization",
      slug: "demo-org",
      plan: Plan.FOUNDER_PRO,
    },
  });

  // Admin user
  const passwordHash = await hash("Password123!", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@seriesos.com" },
    update: {},
    create: {
      organizationId: org.id,
      email: "admin@seriesos.com",
      emailVerified: true,
      name: "Series OS Admin",
      role: UserRole.OWNER,
      passwordHash,
    },
  });

  // Update org admin
  await prisma.organization.update({
    where: { id: org.id },
    data: { adminUserId: adminUser.id },
  });

  // Demo company
  const company = await prisma.company.upsert({
    where: { id: "demo-company-001" },
    update: {},
    create: {
      id: "demo-company-001",
      organizationId: org.id,
      name: "Demo Startup Inc.",
      industry: Industry.SAAS_B2B,
      stage: CompanyStage.EARLY_REVENUE,
      targetRaise: "$1M-$3M",
      fundingGoals: ["ANGEL_VC", "GRANTS_NONDILUTIVE"],
      customerTypes: ["B2B_ENTERPRISE"],
      locationState: "CA",
      description: "AI-powered workflow automation for mid-market companies",
      problem: "Mid-market companies waste 40% of time on manual processes",
      solution: "Our AI automates repetitive workflows, saving 20+ hours per week",
      traction: "$50K ARR, 12 paying customers, 3x YoY growth",
      onboardingComplete: true,
    },
  });

  // Readiness score
  await prisma.readinessScore.upsert({
    where: { companyId: company.id },
    update: {},
    create: {
      companyId: company.id,
      overallScore: 42,
      companyProfileScore: 75,
      teamScore: 40,
      productScore: 60,
      marketScore: 35,
      financialsScore: 30,
      legalScore: 25,
      complianceScore: 15,
      dataRoomScore: 20,
      fundingStrategyScore: 50,
    },
  });

  // Readiness portals (all locked initially)
  for (const portalType of Object.values(PortalType)) {
    await prisma.readinessPortal.upsert({
      where: { companyId_portalType: { companyId: company.id, portalType } },
      update: {},
      create: { companyId: company.id, portalType, locked: true, completionPct: 0 },
    });
  }

  // Data room
  await prisma.dataRoom.upsert({
    where: { companyId: company.id },
    update: {},
    create: { companyId: company.id, watermarkEnabled: true, watermarkText: "CONFIDENTIAL" },
  });

  // Subscription
  await prisma.subscription.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      plan: Plan.FOUNDER_PRO,
      status: "ACTIVE",
      aiCreditsIncluded: 500,
      seatsIncluded: 3,
      companiesIncluded: 3,
    },
  });

  // Sample investors
  const investors = [
    { name: "Sarah Chen", firm: "Sequoia Capital", thesis: "Enterprise SaaS, AI/ML", checkSizeMin: 500, checkSizeMax: 5000, stagesInvested: ["SEED", "SERIES_A"], industriesFocused: ["SAAS_B2B", "AI_ML"] },
    { name: "Marcus Williams", firm: "Andreessen Horowitz", thesis: "Developer tools and infrastructure", checkSizeMin: 1000, checkSizeMax: 10000, stagesInvested: ["SERIES_A", "SERIES_B"], industriesFocused: ["DEVELOPER_TOOLS", "SAAS_B2B"] },
    { name: "Priya Patel", firm: "First Round Capital", thesis: "Diverse founders, B2B SaaS", checkSizeMin: 250, checkSizeMax: 2500, stagesInvested: ["PRE_SEED", "SEED"], industriesFocused: ["SAAS_B2B", "FINTECH"], diversityFocused: true },
  ];

  for (const inv of investors) {
    await prisma.investor.upsert({
      where: { email: `${inv.name.toLowerCase().replace(" ", ".")}@example.com` },
      update: {},
      create: { ...inv, email: `${inv.name.toLowerCase().replace(" ", ".")}@example.com`, verified: true },
    });
  }

  console.log("✅ Seed complete!");
  console.log(`   Org: ${org.name} (${org.slug})`);
  console.log(`   Admin: admin@seriesos.com / Password123!`);
  console.log(`   Company: ${company.name}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
