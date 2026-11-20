import { test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { signToken, verifyToken } from "../src/services/auth.service.js";

test("Un JWT signé permet de retrouver l'identité de l'utilisateur", () => {
  process.env.JWT_SECRET = "secret-reserve-exclusivement-aux-tests";

  const user = {
    id: 1,
    email: "user@example.test",
    role: "USER",
  };

  const token = signToken(user);
  const payload = verifyToken(token);

  assert.equal(typeof token, "string");
  assert.equal(payload.id, user.id);
  assert.equal(payload.email, user.email);
  assert.equal(payload.role, user.role);
});

test("Un JWT falsifié est rejeté", () => {
  process.env.JWT_SECRET = "secret-reserve-exclusivement-aux-tests";

  const token = signToken({
    id: 1,
    email: "user@example.test",
    role: "USER",
  });

  const parts = token.split(".");
  parts[2] = (parts[2][0] === "a" ? "b" : "a") + parts[2].slice(1);

  const forgedToken = parts.join(".");

  assert.throws(
    () => verifyToken(forgedToken),
    { name: "JsonWebTokenError" }
  );
});

test("Un JWT expiré est rejeté", () => {
  process.env.JWT_SECRET = "secret-reserve-exclusivement-aux-tests";

  const token = jwt.sign(
    { id: 1 },
    process.env.JWT_SECRET,
    { expiresIn: -1 }
  );

  assert.throws(
    () => verifyToken(token),
    { name: "TokenExpiredError" }
  );
});