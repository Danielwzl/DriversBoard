import { BaseRepository } from "./BaseRepository.js";

const TABLE = "campaigns";

export class CampaignRepository extends BaseRepository {
  /**
   * @returns {import("better-sqlite3").Row[]}
   */
  findAll() {
    return this.db.prepare(`SELECT * FROM ${TABLE} ORDER BY source ASC, name ASC`).all();
  }

  seedDefaults() {
    const seed = this.db.transaction(() => {
      const existing = this.db.prepare(`SELECT COUNT(*) AS cnt FROM ${TABLE}`).get();
      if (Number(existing.cnt) > 0) return;
      this.insertInto(TABLE, { id: "fb-spring-1", name: "Spring Drivers", source: "facebook" });
      this.insertInto(TABLE, { id: "gg-search-1", name: "Search - Brand", source: "google" });
      this.insertInto(TABLE, { id: "referral-1", name: "Referral Program", source: "referral" });
    });
    seed();
  }

  /**
   * @param {string} id
   */
  exists(id) {
    return Boolean(this.db.prepare(`SELECT 1 AS ok FROM ${TABLE} WHERE id = ?`).get(id));
  }

  /**
   * @param {{ id: string; name: string; source: string }} row
   */
  create(row) {
    this.insertInto(TABLE, row);
  }

  /**
   * @param {string} ref
   * @returns {string | null}
   */
  upsertFromRef(ref) {
    const id = String(ref || "").trim();
    if (!id) return null;
    if (this.exists(id)) return id;

    const lower = id.toLowerCase();
    let source = "unknown";
    if (lower.includes("fb") || lower.includes("facebook")) source = "facebook";
    else if (lower.includes("gg") || lower.includes("google")) source = "google";
    else if (lower.includes("ref")) source = "referral";

    this.create({ id, name: `Campaign ${id}`, source });
    return id;
  }
}
