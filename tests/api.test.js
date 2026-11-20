import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import express from "express";
import { errorHandler } from "../src/middlewares/errors.js";

test("GET /api/tickets : accès non authentifié refusé", async () => {
  const res = await request(app).get("/api/tickets");

  assert.equal(res.status, 401);
  assert.match(res.headers["content-type"] ?? "", /application\/json/);
  assert.equal(typeof res.body.error, "string");
});

test("GET /api/tickets : un JWT invalide est rejeté et supprimé", async () => {
  const res = await request(app)
    .get("/api/tickets")
    .set("Cookie", "token=invalid-token");

  assert.equal(res.status, 401);
  assert.match(res.headers["content-type"] ?? "", /application\/json/);
  assert.match(
    (res.headers["set-cookie"] ?? []).join("; "),
    /token=;/
  );
});

test("Une route API inconnue renvoie une erreur JSON", async () => {
  const res = await request(app).get("/api/inconnue");

  assert.equal(res.status, 404);
  assert.match(
    res.headers["content-type"] ?? "",
    /application\/json/
  );
  assert.equal(typeof res.body.error, "string");
});

test("Un JSON invalide renvoie une erreur HTTP 400", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Content-Type", "application/json")
    .send('{"titre":');

  assert.equal(res.status, 400);
  assert.match(
    res.headers["content-type"] ?? "",
    /application\/json/
  );
  assert.equal(res.body.error, "JSON invalide");
});

test("Une erreur interne ne divulgue aucun détail sensible", async () => {
  const testApp = express();

  testApp.get("/error", () => {
    throw new Error("Information interne confidentielle");
  });

  testApp.use(errorHandler);

  const res = await request(testApp).get("/error");

  assert.equal(res.status, 500);
  assert.equal(res.body.error, "Erreur du serveur");

  assert.doesNotMatch(
    res.text,
    /Information interne confidentielle/
  );
});