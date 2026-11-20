import jwt from "jsonwebtoken";

export function signToken(user) {
  const { id, email, role } = user;

  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
  });
}