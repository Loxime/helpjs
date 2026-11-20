import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import express from "express";
import { errorHandler } from "../src/middlewares/errors.js";
import { requireAuth } from "../src/middlewares/auth.js";
import { HttpError } from "../src/HttpError.js";


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

test("Une page protégée redirige vers la connexion", async () => {
  const testApp = express();

  testApp.get("/private", requireAuth, (req, res) => {
    res.send("Page privée");
  });

  const res = await request(testApp).get("/private");

  assert.equal(res.status, 302);
  assert.equal(res.headers.location, "/login");
});

test("HttpError conserve son statut et son message", () => {
  const error = new HttpError(403, "Accès réservé");

  assert.ok(error instanceof Error);
  assert.equal(error.status, 403);
  assert.equal(error.message, "Accès réservé");
});

test("Une interdiction renvoie un JSON avec HTTP 403", async () => {
  const testApp = express();

  testApp.get("/api/interdit", () => {
    throw new HttpError(403, "Accès réservé");
  });

  testApp.use(errorHandler);

  const res = await request(testApp).get("/api/interdit");

  assert.equal(res.status, 403);
  assert.deepEqual(res.body, {
    error: "Accès réservé",
  });
});