import { CampaignRepository } from "./CampaignRepository.js";
import { DriverRepository } from "./DriverRepository.js";
import { VehicleRepository } from "./VehicleRepository.js";
import { CampaignAnalyticsRepository } from "./CampaignAnalyticsRepository.js";

/**
 * Internal data access layer (Repository). Routes and Controllers should only call the Models exposed by `createFluentModels` (`models/fluent`).
 * @param {import("better-sqlite3").Database} db
 */
export function createRepositories(db) {
  return {
    campaigns: new CampaignRepository(db),
    drivers: new DriverRepository(db),
    vehicles: new VehicleRepository(db),
    analytics: new CampaignAnalyticsRepository(db),
  };
}
