export function dateRangeFromQuery(req) {
  return {
    startDate: typeof req.query.start === "string" ? req.query.start : "",
    endDate: typeof req.query.end === "string" ? req.query.end : "",
  };
}
