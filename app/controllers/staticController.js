export function rootToDashboard(_req, res) {
  res.redirect("/dashboard");
}

export function thankYou(_req, res) {
  res.render("thank_you");
}
