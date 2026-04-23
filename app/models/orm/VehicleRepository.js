import { utcNowIso } from "../db.js";
import { BaseRepository } from "./BaseRepository.js";

const TABLE = "vehicles";

export class VehicleRepository extends BaseRepository {
  /**
   * @returns {import("better-sqlite3").Row[]}
   */
  findAll() {
    return this.db.prepare(`SELECT * FROM ${TABLE} ORDER BY id ASC`).all();
  }

  /**
   * @param {{
   *   driverId: number;
   *   make: string;
   *   model: string;
   *   year: number;
   *   insurancePolicyNumber: string;
   *   insuranceExpiryDate: string;
   * }} data
   */
  create(data) {
    const row = {
      driver_id: data.driverId,
      make: data.make,
      model: data.model,
      year: data.year,
      insurance_policy_number: data.insurancePolicyNumber,
      insurance_expiry_date: data.insuranceExpiryDate,
      created_at: utcNowIso(),
    };
    this.insertInto(TABLE, row);
  }
}
