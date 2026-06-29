import { router } from "@/lib/trpc";
import { authRouter } from "./auth";
import { organizationsRouter } from "./organizations";
import { companiesRouter } from "./companies";
import { readinessRouter } from "./readiness";
import { complianceRouter } from "./compliance";
import { dataRoomRouter } from "./data-room";
import { investorsRouter } from "./investors";
import { grantsRouter } from "./grants";
import { pipelineRouter } from "./pipeline";
import { aiRouter } from "./ai";
import { billingRouter } from "./billing";
import { outreachRouter } from "./outreach";
import { notificationsRouter } from "./notifications";
import { adminRouter } from "./admin";

export const appRouter = router({
  auth: authRouter,
  organizations: organizationsRouter,
  companies: companiesRouter,
  readiness: readinessRouter,
  compliance: complianceRouter,
  dataRoom: dataRoomRouter,
  investors: investorsRouter,
  grants: grantsRouter,
  pipeline: pipelineRouter,
  ai: aiRouter,
  billing: billingRouter,
  outreach: outreachRouter,
  notifications: notificationsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
