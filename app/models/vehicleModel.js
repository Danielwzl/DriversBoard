import { utcNowIso } from "./db.js";

/**
 * @param {import("better-sqlite3").Database} db
 * @param {{
 *   driverId: number;
 *   make: string;
 *   model: string;
 *   year: number;
 *   insurancePolicyNumber: string;
 *   insuranceExpiryDate: string;
 * }} data
 */
export function createVehicle(db, data) {
  const createdAt = utcNowIso();
  db.prepare(
    `
    INSERT INTO vehicles (
      driver_id, make, model, year, insurance_policy_number, insurance_expiry_date, created_at
    ) VALUES (@driverId, @make, @model, @year, @insurancePolicyNumber, @insuranceExpiryDate, @createdAt)
    `
  ).run({ ...data, createdAt });
}
