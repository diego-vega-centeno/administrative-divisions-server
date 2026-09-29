import request from "supertest";
import app from "../../app.js";
import pool from "../../config/db.js";
import { generateTestToken } from "../helpers/testAuth.js";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";

type Relation = {
  id: string;
  admin_level: string;
  [key: string]: unknown;
};

let token: string;
beforeAll(async () => {
  token = await generateTestToken();
});

afterAll(async () => {
  // clean test users
  const usersResult = await pool.query(
    "SELECT id FROM users WHERE name LIKE 'test_user_name'",
  );
  const userIds = usersResult.rows.map((row) => row.id);

  if (userIds.length > 0) {
    await pool.query("DELETE FROM users WHERE id = ANY($1)", [userIds]);
  }
  // Close db connection
  await pool.end();
});

describe("GET /api/v1/countries/:countryId", () => {
  // test("should return 403 if unauthorized", async () => {
  //   const response = await request(app)
  //     .get("/api/v1/countries/288247")
  //     .set("Cookie", `Not-a-token`);

  //   expect(response.status).toBe(403);
  // });

  test("should return 404  and no country found", async () => {
    const response = await request(app)
      .get("/api/v1/countries/not-an-id")
      .set("Cookie", `jwt=${token}`);

    expect(response.status).toBe(404);
  });

  test("should return a valid JSON structure", async () => {
    const response = await request(app).get("/api/v1/countries/288247");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.every((rel: Relation) => typeof rel === "object")).toBe(
      true,
    );

    // Check if data has expected structure
    if (response.body.length > 0) {
      const rels = response.body;
      expect(
        rels.every(
          (rel: Relation) =>
            Object.hasOwn(rel, "id") && Object.hasOwn(rel, "admin_level"),
        ),
      ).toBe(true);
    }
  });

  test("should filter by levels correctly", async () => {
    const response = await request(app)
      .get("/api/v1/countries/288247?levels=4,6")

    expect(response.status).toBe(200);
    expect(
      response.body.every((rel: Relation) =>
        ["4", "6"].includes(rel.admin_level),
      ),
    ).toBe(true);
  });
});
