import { dateRangeFromQuery } from "../lib/dateQuery.js";

export function createAnalyticsController(fluent) {
  const { Analytics } = fluent;

  return {
    viewDashboard(req, res) {
      const { startDate, endDate } = dateRangeFromQuery(req);
      const campaigns = new Analytics().startDate(startDate).endDate(endDate).campaignsSummary();
      const seriesByCampaign = Object.fromEntries(
        campaigns.map((c) => [
          c.id,
          new Analytics().startDate(startDate).endDate(endDate).forCampaign(c.id).signupsOverTime(),
        ])
      );
      res.render("dashboard", { startDate, endDate, campaigns, seriesByCampaign });
    },

    listCampaignsJson(req, res) {
      const { startDate, endDate } = dateRangeFromQuery(req);
      res.json(new Analytics().startDate(startDate).endDate(endDate).campaignsSummary());
    },
  };
}
