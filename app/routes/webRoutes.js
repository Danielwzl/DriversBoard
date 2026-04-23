import { Router } from "express";

import * as homeController from "../controllers/homeController.js";
import { createSignupController } from "../controllers/signupController.js";
import { createVehicleController } from "../controllers/vehicleController.js";
import * as thankYouController from "../controllers/thankYouController.js";
import { createDashboardController } from "../controllers/dashboardController.js";
import { createApiCampaignsController } from "../controllers/apiCampaignsController.js";

/**
 * @param {import("better-sqlite3").Database} db
 */
export function createWebRouter(db) {
  const router = Router();

  const signup = createSignupController(db);
  const vehicle = createVehicleController(db);
  const dashboard = createDashboardController(db);
  const apiCampaigns = createApiCampaignsController(db);

  router.get("/", homeController.redirectDashboard);

  router.get("/signup", signup.show);
  router.post("/signup", signup.submit);

  router.get("/vehicle", vehicle.show);
  router.post("/vehicle", vehicle.submit);

  router.get("/thank-you", thankYouController.showThankYou);

  router.get("/dashboard", dashboard.index);

  router.get("/api/campaigns", apiCampaigns.list);

  return router;
}
