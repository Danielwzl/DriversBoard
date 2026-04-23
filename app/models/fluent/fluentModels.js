/**
 * @param {Record<string, unknown>} attrs
 * @param {string[]} keys
 * @param {string} label
 */
function requireAttrs(attrs, keys, label) {
  for (const k of keys) {
    const v = attrs[k];
    if (v === undefined || v === null || v === "" || (typeof v === "number" && Number.isNaN(v))) {
      throw new Error(`${label}: missing or invalid "${k}"`);
    }
  }
}

/**
 * @param {import("../orm/CampaignRepository.js").CampaignRepository} campaignRepo
 */
function createCampaignClass(campaignRepo) {
  return class Campaign {
    static seedDefaults() {
      campaignRepo.seedDefaults();
    }

    static upsertFromRef(ref) {
      return campaignRepo.upsertFromRef(ref);
    }

    static selectAll() {
      return campaignRepo.findAll();
    }

    constructor() {
      /** @type {{ id?: string; name?: string; source?: string }} */
      this._a = {};
    }

    id(value) {
      this._a.id = String(value);
      return this;
    }
    campaignName(value) {
      this._a.name = String(value);
      return this;
    }
    source(value) {
      this._a.source = String(value);
      return this;
    }

    save() {
      for (const k of ["id", "name", "source"]) {
        if (!this._a[k]) throw new Error(`Campaign.save(): missing "${k}"`);
      }
      campaignRepo.create({ id: this._a.id, name: this._a.name, source: this._a.source });
      return this;
    }
  };
}

/**
 * @param {import("../orm/DriverRepository.js").DriverRepository} driverRepo
 */
function createDriverClass(driverRepo) {
  return class Driver {
    static selectAll() {
      return driverRepo.findAll();
    }

    constructor() {
      /** @type {Record<string, string | undefined>} */
      this._a = {};
    }

    campaignId(v) { this._a.campaignId = String(v); return this; }
    fullName(v) { this._a.fullName = String(v); return this; }
    email(v) { this._a.email = String(v); return this; }
    phone(v) { this._a.phone = String(v); return this; }
    licenseNumber(v) { this._a.licenseNumber = String(v); return this; }
    licenseRegion(v) { this._a.licenseRegion = String(v); return this; }

    save() {
      requireAttrs(
        this._a,
        ["campaignId", "fullName", "email", "phone", "licenseNumber", "licenseRegion"],
        "Driver.save()"
      );
      return driverRepo.create({
        campaignId: String(this._a.campaignId),
        fullName: String(this._a.fullName),
        email: String(this._a.email),
        phone: String(this._a.phone),
        licenseNumber: String(this._a.licenseNumber),
        licenseRegion: String(this._a.licenseRegion),
      });
    }
  };
}

/**
 * @param {import("../orm/VehicleRepository.js").VehicleRepository} vehicleRepo
 */
function createVehicleClass(vehicleRepo) {
  return class Vehicle {
    static selectAll() {
      return vehicleRepo.findAll();
    }

    constructor() {
      this._a = {};
    }

    /** Maps to the `model` column */
    name(v) { this._a.model = String(v); return this; }
    make(v) { this._a.make = String(v); return this; }
    model(v) { this._a.model = String(v); return this; }
    year(v) { this._a.year = typeof v === "string" ? Number(v) : Number(v); return this; }
    driverId(v) { this._a.driverId = Number(v); return this; }
    insurancePolicyNumber(v) { this._a.insurancePolicyNumber = String(v); return this; }
    insuranceExpiryDate(v) { this._a.insuranceExpiryDate = String(v); return this; }

    save() {
      requireAttrs(
        this._a,
        ["driverId", "make", "model", "year", "insurancePolicyNumber", "insuranceExpiryDate"],
        "Vehicle.save()"
      );
      vehicleRepo.create({
        driverId: Number(this._a.driverId),
        make: String(this._a.make),
        model: String(this._a.model),
        year: Number(this._a.year),
        insurancePolicyNumber: String(this._a.insurancePolicyNumber),
        insuranceExpiryDate: String(this._a.insuranceExpiryDate),
      });
      return this;
    }
  };
}

/**
 * @param {import("../orm/CampaignAnalyticsRepository.js").CampaignAnalyticsRepository} repo
 */
function createAnalyticsClass(repo) {
  return class Analytics {
    constructor() {
      this._start = "";
      this._end = "";
      /** @type {string | null} */
      this._campaign = null;
    }
    startDate(v) { this._start = typeof v === "string" ? v : ""; return this; }
    endDate(v) { this._end = typeof v === "string" ? v : ""; return this; }
    forCampaign(id) { this._campaign = String(id); return this; }

    campaignsSummary() {
      return repo.getCampaignsSummary({ startDate: this._start, endDate: this._end });
    }
    signupsOverTime() {
      if (!this._campaign) throw new Error("Analytics: call forCampaign(id) before signupsOverTime()");
      return repo.getSignupsOverTime(this._campaign, { startDate: this._start, endDate: this._end });
    }
  };
}

/**
 * @param {ReturnType<typeof import("../orm/index.js").createRepositories>} repos
 */
export function createFluentModels(repos) {
  return {
    Campaign: createCampaignClass(repos.campaigns),
    Driver: createDriverClass(repos.drivers),
    Vehicle: createVehicleClass(repos.vehicles),
    Analytics: createAnalyticsClass(repos.analytics),
  };
}
