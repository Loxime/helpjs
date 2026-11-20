import { test } from "node:test";
import assert from "node:assert/strict";
import { loadUser } from "../src/middlewares/auth.js";
import { signToken } from "../src/services/auth.service.js";

test("Un JWT valide permet d'identifier l'utilisateur", () => {
  process.env.JWT_SECRET = "secret-reserve-exclusivement-aux-tests";

  const token = signToken({
    id: 1,
    email: "user@example.test",
    role: "USER",
  });

  const req = { cookies: { token } };
  const res = { locals: {} };
  let nextCalled = false;

  loadUser(req, res, () => {
    nextCalled = true;
  });

  assert.equal(req.user.id, 1);
  assert.equal(res.locals.user.id, 1);
  assert.equal(nextCalled, true);
});

test("Un JWT invalide est supprimé des cookies", () => {
  process.env.JWT_SECRET = "secret-reserve-exclusivement-aux-tests";

  const req = { cookies: { token: "invalid-token" } };
  const clearedCookies = [];
  const res = {
    locals: {},
    clearCookie(name) {
      clearedCookies.push(name);
    },
  };
  let nextCalled = false;

  loadUser(req, res, () => {
    nextCalled = true;
  });

  assert.equal(req.user, null);
  assert.equal(res.locals.user, null);
  assert.deepEqual(clearedCookies, ["token"]);
  assert.equal(nextCalled, true);
});