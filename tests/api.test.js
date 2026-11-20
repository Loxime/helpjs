import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";

test("GET /api/tickets : accès non authentifié refusé", async () => {
  const res = await request(app).get("/api/tickets");

  assert.equal(res.status, 401);
  assert.match(res.headers["content-type"] ?? "", /application\/json/);
  assert.equal(typeof res.body.error, "string");
});