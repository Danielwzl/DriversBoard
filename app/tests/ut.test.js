import { describe, expect, test } from "vitest";
import request from "supertest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { createApp } from "../app.js";

function tmpDbPath() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wrapped-media-"));
  return path.join(dir, "test.sqlite");
}

describe("onboarding + analytics MVP", () => {
  test("signup stores campaign ref and vehicle completion affects conversion", async () => {
    const dbPath = tmpDbPath();
    const { app, db } = createApp({ dbPath });

    // No signups initially.
    let res = await request(app).get("/api/campaigns");
    expect(res.status).toBe(200);
    const before = res.body.find((c) => c.id === "fb-spring-1");
    expect(before.totalSignups).toBe(0);
    expect(before.completedSignups).toBe(0);

    // Submit signup (ref -> campaign).
    res = await request(app)
      .post("/signup")
      .type("form")
      .send({
        ref: "fb-spring-1",
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        phone: "1234567890",
        licenseNumber: "D1234",
        licenseRegion: "CA",
      });
    expect(res.status).toBe(302);
    expect(res.headers.location).toMatch(/^\/vehicle\?driverId=\d+$/);

    const driver = db.prepare("SELECT * FROM drivers ORDER BY id DESC LIMIT 1").get();
    expect(driver.campaign_id).toBe("fb-spring-1");

    // Register vehicle with valid insurance (far future).
    res = await request(app)
      .post("/vehicle")
      .type("form")
      .send({
        driverId: String(driver.id),
        make: "Toyota",
        model: "Prius",
        year: "2020",
        insurancePolicyNumber: "POLICY-1",
        insuranceExpiryDate: "2099-01-01",
      });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/thank-you");

    // Campaign now has total=1 completed=1.
    res = await request(app).get("/api/campaigns");
    const after = res.body.find((c) => c.id === "fb-spring-1");
    expect(after.totalSignups).toBe(1);
    expect(after.completedSignups).toBe(1);
    expect(after.conversionRate).toBeCloseTo(1);
  });

  test("expired insurance does not count as completed", async () => {
    const dbPath = tmpDbPath();
    const { app } = createApp({ dbPath });

    let res = await request(app)
      .post("/signup")
      .type("form")
      .send({
        ref: "gg-search-1",
        fullName: "Grace Hopper",
        email: "grace@example.com",
        phone: "1234567890",
        licenseNumber: "X999",
        licenseRegion: "NY",
      });
    const loc = res.headers.location;
    const driverId = Number(new URL("http://x" + loc).searchParams.get("driverId"));

    // Expired date.
    res = await request(app)
      .post("/vehicle")
      .type("form")
      .send({
        driverId: String(driverId),
        make: "Honda",
        model: "Civic",
        year: "2018",
        insurancePolicyNumber: "POLICY-2",
        insuranceExpiryDate: "2000-01-01",
      });
    expect(res.status).toBe(302);

    res = await request(app).get("/api/campaigns");
    const row = res.body.find((c) => c.id === "gg-search-1");
    expect(row.totalSignups).toBe(1);
    expect(row.completedSignups).toBe(0);
    expect(row.conversionRate).toBeCloseTo(0);
  });

  test("fluent Vehicle: chain setters + save + static selectAll", () => {
    const dbPath = tmpDbPath();
    const { fluent } = createApp({ dbPath });
    const { Driver, Vehicle } = fluent;

    const driverId = new Driver()
      .campaignId("fb-spring-1")
      .fullName("Test User")
      .email("t@example.com")
      .phone("5550000")
      .licenseNumber("L1")
      .licenseRegion("TX")
      .save();

    new Vehicle()
      .driverId(driverId)
      .make("Honda")
      .name("Civic")
      .year("2019")
      .insurancePolicyNumber("FLU-1")
      .insuranceExpiryDate("2099-06-01")
      .save();

    const rows = Vehicle.selectAll();
    expect(rows.length).toBe(1);
    expect(rows[0].model).toBe("Civic");
    expect(rows[0].year).toBe(2019);
  });
});