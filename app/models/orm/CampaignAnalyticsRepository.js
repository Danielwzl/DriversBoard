import { BaseRepository } from "./BaseRepository.js";

function clampIsoDate(isoDate) {
  if (!isoDate) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? isoDate : null;
}

export class CampaignAnalyticsRepository extends BaseRepository {
  /**
   * @param {{ startDate?: string; endDate?: string }} range
   */
  getCampaignsSummary({ startDate, endDate } = {}) {
    const start = clampIsoDate(startDate);
    const end = clampIsoDate(endDate);

    const where = [];
    const params = {};

    if (start) {
      where.push("d.created_at >= @start");
      params.start = start;
    }
    if (end) {
      where.push("d.created_at < date(@end, '+1 day')");
      params.end = end;
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const stmt = this.db.prepare(`
      SELECT
        c.id AS campaign_id,
        c.name AS campaign_name,
        c.source AS campaign_source,
        COUNT(d.id) AS total_signups,
        SUM(
          CASE WHEN EXISTS (
            SELECT 1
            FROM vehicles v
            WHERE v.driver_id = d.id
              AND date(v.insurance_expiry_date) >= date('now')
          ) THEN 1 ELSE 0 END
        ) AS completed_signups
      FROM campaigns c
      LEFT JOIN drivers d ON d.campaign_id = c.id
      ${whereSql}
      GROUP BY c.id
      ORDER BY c.source, c.name
    `);

    return stmt.all(params).map((r) => {
      const total = Number(r.total_signups || 0);
      const completed = Number(r.completed_signups || 0);
      const rate = total ? completed / total : 0;
      return {
        id: String(r.campaign_id),
        name: String(r.campaign_name),
        source: String(r.campaign_source),
        totalSignups: total,
        completedSignups: completed,
        conversionRate: rate,
      };
    });
  }

  /**
   * @param {string} campaignId
   * @param {{ startDate?: string; endDate?: string }} range
   */
  getSignupsOverTime(campaignId, { startDate, endDate } = {}) {
    const start = clampIsoDate(startDate);
    const end = clampIsoDate(endDate);

    const where = ["d.campaign_id = @campaignId"];
    const params = { campaignId };

    if (start) {
      where.push("d.created_at >= @start");
      params.start = start;
    }
    if (end) {
      where.push("d.created_at < date(@end, '+1 day')");
      params.end = end;
    }

    const stmt = this.db.prepare(`
      SELECT substr(d.created_at, 1, 10) AS day, COUNT(*) AS signups
      FROM drivers d
      WHERE ${where.join(" AND ")}
      GROUP BY day
      ORDER BY day ASC
    `);

    return stmt.all(params).map((r) => ({
      day: String(r.day),
      signups: Number(r.signups),
    }));
  }
}
