import { Router } from "express";

import { rootToDashboard, thankYou } from "../controllers/staticController.js";

/**
 * @param {ReturnType<typeof import("../models/fluent/index.js")["createFluentModels"]>} fluent
 */
export function createWebRouter(fluent) {
  const router = Router();

  router.get("/", rootToDashboard);
  router.get("/thank-you", thankYou);

  return router;
}