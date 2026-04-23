import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { openDb } from "./models/db.js";
import { createRepositories } from "./models/orm/index.js";
import { createFluentModels } from "./models/fluent/index.js";
import { createWebRouter } from "./routes/webRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp({ dbPath } = {}) {
  const db = openDb(dbPath);
  const repos = createRepositories(db);
  const fluent = createFluentModels(repos);
  fluent.Campaign.seedDefaults();

  const app = express();
  app.disable("x-powered-by");
  app.use(express.urlencoded({ extended: false }));
  app.use("/static", express.static(path.join(__dirname, "static")));

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use(createWebRouter(fluent));

  return { app, db, fluent };
}
