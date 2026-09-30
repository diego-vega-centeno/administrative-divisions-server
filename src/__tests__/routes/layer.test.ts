import request from "supertest";
import app from "../../../src/app.js";
import pool from "../../config/db.js";
import { generateTestToken } from "../helpers/testAuth.js";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";

type Relation = {
  relId: string;
  relName: string;
  adminLevel: string;
  parentsNames: string;
  [key: string]: unknown;
};

let token: string;
let layerId: string;

beforeAll(async () => {
  // generate token using secure test helper
  token = await generateTestToken();
});

afterAll(async () => {
  // clean test users
  const usersResult = await pool.query(
    "SELECT id FROM users WHERE name LIKE 'test_user_name'",
  );
  const userIds = usersResult.rows.map((row) => row.id);

  // delete test user
  if (userIds.length > 0) {
    await pool.query("DELETE FROM users WHERE id = ANY($1)", [userIds]);
  }

  // Close db connection
  await pool.end();
});

describe("PUT /layer", () => {
  test("should successfuly add new layer", async () => {
    const response = await request(app)
      .put("/layer")
      .set("Cookie", `jwt=${token}`)
      .send({
        title: "test_layer_title",
        relations: [
          {
            relId: "1",
            relName: "1-name",
            adminLevel: "4",
            parentsNames: "p-1-1, p-1-2",
          },
          {
            relId: "2",
            relName: "2-name",
            adminLevel: "4",
            parentsNames: "p-2-1, p-2-2",
          },
        ],
      } as { title: string; relations: Relation[] });

    // store id of created layer
    layerId = response.body.data.layerId;

    expect(response.status).toBe(201);
  });

  test("should return 403 if unauthorized", async () => {
    const response = await request(app)
      .put("/layer")
      .set("Cookie", `Not-a-cookie`);

    expect(response.status).toBe(403);
  });

  test("should return 400 if relId is missing", async () => {
    const response = await request(app)
      .put("/layer")
      .set("Cookie", `jwt=${token}`)
      .send({
        title: "test_layer_title",
        relations: [{ relName: "1-name" }, { relId: "2", relName: "2-name" }],
      });

    expect(response.status).toBe(400);
  });

  test("should return 400 if relName is missing", async () => {
    const response = await request(app)
      .put("/layer")
      .set("Cookie", `jwt=${token}`)
      .send({
        title: "test_layer_title",
        relations: [{ relId: "1" }, { relId: "2", relName: "2-name" }],
      });

    expect(response.status).toBe(400);
  });
});

describe("GET /layer/:id", () => {
  test("should return 200 and user favorites", async () => {
    const response = await request(app)
      .get(`/layer/${layerId}`)
      .set("Cookie", `jwt=${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data).not.toHaveLength(0);

    // favorite = response.body[0];
  });

  // test('should successfully delete favorite', async () => {
  //   const response = await request(app)
  //     .delete(`/api/favorites/${favorite.id}`)
  //     .set('Authorization', `Bearer ${token}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body.status).toBe('OK');
  // });
});
