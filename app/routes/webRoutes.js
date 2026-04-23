import { Router } from "express";

import { createAnalyticsController } from "../controllers/analyticsController.js";
import { createSignupController, createVehicleController } from "../controllers/onboardingController.js";
import { rootToDashboard, thankYou } from "../controllers/staticController.js";

/**
 * @param {ReturnType<typeof import("../models/fluent/index.js")["createFluentModels"]>} fluent
 */
export function createWebRouter(fluent) {
  const router = Router();
  const signup = createSignupController(fluent);
  const vehicle = createVehicleController(fluent);
  const analytics = createAnalyticsController(fluent);

  router.get("/", rootToDashboard);
  router.get("/thank-you", thankYou);

  router.get("/signup", signup.show);
  router.post("/signup", signup.submit);
  router.get("/vehicle", vehicle.show);
  router.post("/vehicle", vehicle.submit);

  router.get("/dashboard", analytics.viewDashboard);
  router.get("/api/campaigns", analytics.listCampaignsJson);

  return router;
}
