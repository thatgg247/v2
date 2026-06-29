-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FOUNDER_STARTER', 'FOUNDER_PRO', 'FOUNDER_SCALE', 'ADVISOR', 'ACCELERATOR', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'ADVISOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "CompanyStage" AS ENUM ('IDEA', 'MVP', 'PRE_REVENUE', 'EARLY_REVENUE', 'SCALING');

-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('SAAS_B2B', 'CONSUMER_APP', 'AI_ML', 'CYBERSECURITY', 'DEVELOPER_TOOLS', 'DATA_ANALYTICS', 'WEB3_CRYPTO', 'FINTECH', 'INSURTECH', 'PAYMENTS_BANKING', 'REAL_ESTATE', 'HEALTHTECH', 'BIOTECH', 'MENTAL_HEALTH', 'MEDICAL_DEVICES', 'CONSUMER_GOODS', 'ECOMMERCE_RETAIL', 'FOOD_BEVERAGE', 'FASHION_BEAUTY', 'MEDIA_ENTERTAINMENT', 'GAMING', 'CLEANTECH_CLIMATE', 'SOCIAL_IMPACT', 'GOVTECH', 'DEFENSE_NATIONAL_SECURITY', 'AGTECH', 'EDTECH', 'HRTECH', 'LEGALTECH', 'LOGISTICS', 'HARDWARE_MANUFACTURING', 'SPACE_AEROSPACE', 'OTHER');

-- CreateEnum
CREATE TYPE "FundingGoal" AS ENUM ('ANGEL_VC', 'GRANTS_NONDILUTIVE', 'ACCELERATORS', 'GOVERNMENT_CONTRACTS', 'DEBT_REVENUE_BASED', 'SBIR_STTR');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('B2B_ENTERPRISE', 'B2B_SMB', 'B2C_CONSUMER', 'GOVERNMENT_FEDERAL', 'GOVERNMENT_STATE_LOCAL', 'HEALTHCARE', 'DEFENSE', 'NONPROFIT');

-- CreateEnum
CREATE TYPE "DataClassification" AS ENUM ('NONE', 'PII', 'PHI_HIPAA', 'CUI_CMMC', 'FINANCIAL_PCI', 'CLASSIFIED');

-- CreateEnum
CREATE TYPE "PortalType" AS ENUM ('INVESTOR', 'GRANT', 'ENTERPRISE', 'GOVERNMENT_CONTRACT', 'COMPLIANCE', 'ACQUISITION', 'FDA', 'SBIR', 'MANUFACTURING', 'RETAIL', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "ComplianceFramework" AS ENUM ('SOC2_TYPE1', 'SOC2_TYPE2', 'HIPAA', 'HITECH', 'HITRUST', 'GDPR', 'CCPA', 'PCI_DSS', 'AML_KYC', 'CMMC_LEVEL1', 'CMMC_LEVEL2', 'CMMC_LEVEL3', 'FEDRAMP', 'NIST_AI_RMF', 'ISO_42001', 'ISO_27001', 'ISO_13485', 'GLP', 'GMP', 'FDA_510K', 'FDA_PMA', 'ITAR', 'EAR', 'FERPA', 'COPPA', 'SAM_UEI_REGISTRATION', 'SBIR_ELIGIBILITY', 'TRADEMARK', 'PRODUCT_LIABILITY', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETE', 'WAIVED', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "PipelineContactType" AS ENUM ('INVESTOR', 'GRANT', 'ACCELERATOR', 'GOVERNMENT', 'VENDOR');

-- CreateEnum
CREATE TYPE "PipelineStage" AS ENUM ('RESEARCHING', 'CONTACTED', 'MEETING_SCHEDULED', 'MEETING_COMPLETE', 'DILIGENCE', 'TERM_SHEET', 'CLOSED_WON', 'CLOSED_LOST', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PITCH_DECK', 'FINANCIAL_PROJECTIONS', 'EXECUTIVE_SUMMARY', 'CAP_TABLE', 'TEAM_BIOS', 'PRODUCT_DEMO', 'LEGAL_INCORPORATION', 'CUSTOMER_TESTIMONIALS', 'MARKET_RESEARCH', 'PATENT_IP', 'COMPLIANCE_CERT', 'GRANT_APPLICATION', 'CAPABILITY_STATEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "AIOutputType" AS ENUM ('EMAIL_COLD_INTRO', 'EMAIL_FOLLOWUP', 'EMAIL_SEND_DECK', 'EMAIL_MEETING_REQUEST', 'EMAIL_INVESTOR_UPDATE', 'EXEC_SUMMARY', 'INVESTOR_MEMO', 'FOUNDER_BIO', 'TEAM_BIO', 'USE_OF_FUNDS', 'MILESTONE_PLAN', 'GRANT_ABSTRACT', 'CAPABILITY_STATEMENT', 'COMPLIANCE_POLICY', 'PITCH_SCORE', 'REPLY_CLASSIFY', 'CALL_PREP', 'INVESTOR_RESEARCH', 'COMPLIANCE_ADVISOR');

-- CreateEnum
CREATE TYPE "SendQueueStatus" AS ENUM ('PENDING', 'APPROVED', 'BLOCKED', 'SENT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OutreachEventStatus" AS ENUM ('SENT', 'OPENED', 'CLICKED', 'REPLIED', 'BOUNCED', 'UNSUBSCRIBED', 'FAILED');

-- CreateEnum
CREATE TYPE "SuppressionReason" AS ENUM ('UNSUBSCRIBED', 'BOUNCED', 'COMPLAINT', 'MANUAL', 'COMPETITOR');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'UNPAID', 'PAUSED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ACCESS', 'SHARE', 'EXPORT', 'LOGIN', 'LOGOUT', 'INVITE', 'REMOVE', 'IMPERSONATE');

-- CreateEnum
CREATE TYPE "CertificationType" AS ENUM ('INVESTOR_READY', 'GRANT_READY', 'ENTERPRISE_READY', 'GOVERNMENT_CONTRACT_READY', 'COMPLIANCE_READY');

-- CreateEnum
CREATE TYPE "MarketplaceServiceType" AS ENUM ('SOC2_AUDIT', 'HIPAA_COMPLIANCE', 'CMMC_CERTIFICATION', 'GRANT_WRITING', 'PATENT_SERVICES', 'FRACTIONAL_CFO', 'REGULATORY_STRATEGY', 'INVESTOR_RELATIONS', 'LEGAL_FORMATION', 'TRADEMARK_REGISTRATION', 'FDA_CONSULTING', 'SBIR_CONSULTING', 'OTHER');

-- CreateEnum
CREATE TYPE "UsageEventType" AS ENUM ('AI_TOKEN', 'EMAIL_SEND', 'DOCUMENT_DOWNLOAD', 'DOCUMENT_UPLOAD', 'SEAT_ADDED', 'COMPANY_ADDED', 'SHARE_LINK_CREATED');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FOUNDER_STARTER',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "adminUserId" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "whitelabelEnabled" BOOLEAN NOT NULL DEFAULT false,
    "whitelabelDomain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "passwordHash" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "invitedBy" TEXT,
    "inviteToken" TEXT,
    "inviteExpiresAt" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetExpiresAt" TIMESTAMP(3),
    "verifyToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" "Industry" NOT NULL DEFAULT 'OTHER',
    "stage" "CompanyStage" NOT NULL DEFAULT 'IDEA',
    "revenue" TEXT,
    "targetRaise" TEXT,
    "fundingGoals" "FundingGoal"[],
    "customerTypes" "CustomerType"[],
    "dataClassification" "DataClassification" NOT NULL DEFAULT 'NONE',
    "locationState" TEXT,
    "locationCountry" TEXT NOT NULL DEFAULT 'US',
    "websiteUrl" TEXT,
    "linkedinUrl" TEXT,
    "description" TEXT,
    "problem" TEXT,
    "solution" TEXT,
    "traction" TEXT,
    "useOfFunds" TEXT,
    "pitchDeckUrl" TEXT,
    "teamSize" INTEGER,
    "foundedYear" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "readiness_scores" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL DEFAULT 0,
    "companyProfileScore" INTEGER NOT NULL DEFAULT 0,
    "teamScore" INTEGER NOT NULL DEFAULT 0,
    "productScore" INTEGER NOT NULL DEFAULT 0,
    "marketScore" INTEGER NOT NULL DEFAULT 0,
    "financialsScore" INTEGER NOT NULL DEFAULT 0,
    "legalScore" INTEGER NOT NULL DEFAULT 0,
    "complianceScore" INTEGER NOT NULL DEFAULT 0,
    "dataRoomScore" INTEGER NOT NULL DEFAULT 0,
    "fundingStrategyScore" INTEGER NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "readiness_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "readiness_portals" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "portalType" "PortalType" NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT true,
    "completionPct" INTEGER NOT NULL DEFAULT 0,
    "unlockedAt" TIMESTAMP(3),
    "requiredItemIds" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "readiness_portals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_requirements" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "framework" "ComplianceFramework" NOT NULL,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" INTEGER NOT NULL DEFAULT 5,
    "estimatedCostMin" INTEGER,
    "estimatedCostMax" INTEGER,
    "estimatedWeeks" INTEGER,
    "vendorCategories" "MarketplaceServiceType"[],
    "whyItMatters" TEXT,
    "howToAchieve" TEXT,
    "nextActions" TEXT[],
    "documentUrl" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_rooms" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "shareEnabled" BOOLEAN NOT NULL DEFAULT false,
    "shareExpiresAt" TIMESTAMP(3),
    "requireNDA" BOOLEAN NOT NULL DEFAULT false,
    "watermarkEnabled" BOOLEAN NOT NULL DEFAULT false,
    "watermarkText" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastSharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "dataRoomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "docType" "DocumentType" NOT NULL DEFAULT 'OTHER',
    "storageKey" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "externalUrl" TEXT,
    "uploadedById" TEXT NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastAccessedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firm" TEXT,
    "email" TEXT,
    "linkedinUrl" TEXT,
    "websiteUrl" TEXT,
    "twitterUrl" TEXT,
    "photoUrl" TEXT,
    "thesis" TEXT,
    "checkSizeMin" INTEGER,
    "checkSizeMax" INTEGER,
    "stagesInvested" TEXT[],
    "industriesFocused" TEXT[],
    "geographyFocused" TEXT[],
    "diversityFocused" BOOLEAN NOT NULL DEFAULT false,
    "notable" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grants" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "programType" TEXT NOT NULL,
    "description" TEXT,
    "maxAmount" INTEGER,
    "deadline" TIMESTAMP(3),
    "eligibilityCriteria" TEXT[],
    "industriesFocused" TEXT[],
    "geographyFocused" TEXT[],
    "externalUrl" TEXT,
    "sourceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipelines" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "contactType" "PipelineContactType" NOT NULL,
    "investorId" TEXT,
    "grantId" TEXT,
    "contactName" TEXT NOT NULL,
    "contactFirm" TEXT,
    "contactEmail" TEXT,
    "stage" "PipelineStage" NOT NULL DEFAULT 'RESEARCHING',
    "matchScore" INTEGER,
    "notes" TEXT,
    "nextFollowUp" TIMESTAMP(3),
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cap_table_entries" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "shareType" TEXT NOT NULL DEFAULT 'Common',
    "shares" DOUBLE PRECISION,
    "ownershipPct" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cap_table_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safe_notes" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "investorName" TEXT NOT NULL,
    "amountUsd" DOUBLE PRECISION NOT NULL,
    "valuationCapUsd" DOUBLE PRECISION,
    "discountRate" DOUBLE PRECISION,
    "investmentDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "safe_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_connections" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'MERCURY',
    "encryptedToken" TEXT NOT NULL,
    "accountName" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_outputs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "outputType" "AIOutputType" NOT NULL,
    "prompt" TEXT,
    "response" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "modelUsed" TEXT NOT NULL DEFAULT 'claude-3-haiku-20240307',
    "costUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outreach_events" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT,
    "recipientFirm" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sequenceStage" INTEGER NOT NULL DEFAULT 1,
    "subjectLine" TEXT,
    "bodyHash" TEXT,
    "status" "OutreachEventStatus" NOT NULL DEFAULT 'SENT',
    "matchScore" INTEGER,
    "openedAt" TIMESTAMP(3),
    "repliedAt" TIMESTAMP(3),

    CONSTRAINT "outreach_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "send_queue" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT,
    "recipientFirm" TEXT,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "status" "SendQueueStatus" NOT NULL DEFAULT 'PENDING',
    "blockReason" TEXT,
    "matchScore" INTEGER,
    "sequenceStage" INTEGER NOT NULL DEFAULT 1,
    "emailSubject" TEXT,
    "emailBody" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "send_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppression_lists" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "domain" TEXT,
    "reason" "SuppressionReason" NOT NULL DEFAULT 'MANUAL',
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "addedByOrgId" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suppression_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCustomerId" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FOUNDER_STARTER',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "aiCreditsIncluded" INTEGER NOT NULL DEFAULT 100,
    "aiCreditsUsed" INTEGER NOT NULL DEFAULT 0,
    "seatsIncluded" INTEGER NOT NULL DEFAULT 1,
    "companiesIncluded" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_events" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "eventType" "UsageEventType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stripeUsageRecordId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "before" JSONB,
    "after" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "certType" "CertificationType" NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "badgeUrl" TEXT,
    "verificationCode" TEXT NOT NULL,
    "publicUrl" TEXT,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_listings" (
    "id" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "providerEmail" TEXT NOT NULL,
    "serviceType" "MarketplaceServiceType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priceMin" INTEGER,
    "priceMax" INTEGER,
    "deliveryWeeks" INTEGER,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "websiteUrl" TEXT,
    "calendlyUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "referrerOrgId" TEXT NOT NULL,
    "referredEmail" TEXT NOT NULL,
    "referredOrgId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "commissionUsd" DOUBLE PRECISION,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_stripeCustomerId_key" ON "organizations"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_stripeSubscriptionId_key" ON "organizations"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_whitelabelDomain_key" ON "organizations"("whitelabelDomain");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_inviteToken_key" ON "users"("inviteToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetToken_key" ON "users"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_verifyToken_key" ON "users"("verifyToken");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "readiness_scores_companyId_key" ON "readiness_scores"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "readiness_portals_companyId_portalType_key" ON "readiness_portals"("companyId", "portalType");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_requirements_companyId_framework_key" ON "compliance_requirements"("companyId", "framework");

-- CreateIndex
CREATE UNIQUE INDEX "data_rooms_companyId_key" ON "data_rooms"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "data_rooms_shareToken_key" ON "data_rooms"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "investors_email_key" ON "investors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "suppression_lists_email_addedByOrgId_key" ON "suppression_lists"("email", "addedByOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "suppression_lists_domain_addedByOrgId_key" ON "suppression_lists"("domain", "addedByOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_organizationId_key" ON "subscriptions"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "audit_logs_organizationId_createdAt_idx" ON "audit_logs"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_resource_resourceId_idx" ON "audit_logs"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE UNIQUE INDEX "certifications_verificationCode_key" ON "certifications"("verificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "certifications_companyId_certType_key" ON "certifications"("companyId", "certType");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readiness_scores" ADD CONSTRAINT "readiness_scores_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readiness_portals" ADD CONSTRAINT "readiness_portals_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_requirements" ADD CONSTRAINT "compliance_requirements_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_rooms" ADD CONSTRAINT "data_rooms_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_dataRoomId_fkey" FOREIGN KEY ("dataRoomId") REFERENCES "data_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "grants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cap_table_entries" ADD CONSTRAINT "cap_table_entries_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_notes" ADD CONSTRAINT "safe_notes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_connections" ADD CONSTRAINT "bank_connections_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_outputs" ADD CONSTRAINT "ai_outputs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_outputs" ADD CONSTRAINT "ai_outputs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outreach_events" ADD CONSTRAINT "outreach_events_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "send_queue" ADD CONSTRAINT "send_queue_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_events" ADD CONSTRAINT "usage_events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrerOrgId_fkey" FOREIGN KEY ("referrerOrgId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referredOrgId_fkey" FOREIGN KEY ("referredOrgId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
