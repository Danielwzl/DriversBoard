import { DriverCreateSchema, VehicleCreateSchema, fieldErrorsForForm } from "../validation.js";

export function createSignupController(fluent) {
  const { Campaign, Driver } = fluent;

  return {
    show(req, res) {
      const ref = typeof req.query.ref === "string" ? req.query.ref : "";
      res.render("signup", { ref, errors: {}, values: {} });
    },

    submit(req, res) {
      const ref = String(req.body.ref ?? "");
      const campaignId = Campaign.upsertFromRef(ref);
      const parsed = DriverCreateSchema.safeParse({
        campaignId: campaignId || "",
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        licenseNumber: req.body.licenseNumber,
        licenseRegion: req.body.licenseRegion,
      });

      if (!parsed.success) {
        return res.status(400).render("signup", {
          ref,
          errors: fieldErrorsForForm(parsed.error),
          values: req.body,
        });
      }

      const d = parsed.data;
      const id = new Driver()
        .campaignId(d.campaignId)
        .fullName(d.fullName)
        .email(d.email)
        .phone(d.phone)
        .licenseNumber(d.licenseNumber)
        .licenseRegion(d.licenseRegion)
        .save();
      res.redirect(`/vehicle?driverId=${id}`);
    },
  };
}

export function createVehicleController(fluent) {
  const { Vehicle } = fluent;

  return {
    show(req, res) {
      res.render("vehicle", { driverId: req.query.driverId, errors: {}, values: {} });
    },

    submit(req, res) {
      const parsed = VehicleCreateSchema.safeParse({
        driverId: req.body.driverId,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        insurancePolicyNumber: req.body.insurancePolicyNumber,
        insuranceExpiryDate: req.body.insuranceExpiryDate,
      });

      if (!parsed.success) {
        return res.status(400).render("vehicle", {
          driverId: req.body.driverId,
          errors: fieldErrorsForForm(parsed.error),
          values: req.body,
        });
      }

      const v = parsed.data;
      new Vehicle()
        .driverId(v.driverId)
        .make(v.make)
        .model(v.model)
        .year(v.year)
        .insurancePolicyNumber(v.insurancePolicyNumber)
        .insuranceExpiryDate(v.insuranceExpiryDate)
        .save();
      res.redirect("/thank-you");
    },
  };
}
