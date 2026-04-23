import { utcNowIso } from "../db.js";
import { BaseRepository } from "./BaseRepository.js";

const TABLE = "drivers";

export class DriverRepository extends BaseRepository {
  /**
   * @returns {import("better-sqlite3").Row[]}
   */
  findAll() {
    return this.db.prepare(`SELECT * FROM ${TABLE} ORDER BY id ASC`).all();
  }

  /**
   * @param {{
   *   campaignId: string;
   *   fullName: string;
   *   email: string;
   *   phone: string;
   *   licenseNumber: string;
   *   licenseRegion: string;
   * }} data
   * @returns {number} lastInsertRowid
   */
  create(data) {
    const row = {
      campaign_id: data.campaignId,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      license_number: data.licenseNumber,
      license_region: data.licenseRegion,
      created_at: utcNowIso(),
    };
    const result = this.insertInto(TABLE, row);
    return Number(result.lastInsertRowid);
  }
}
