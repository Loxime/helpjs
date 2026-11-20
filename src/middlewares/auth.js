import { verifyToken } from "../services/auth.service.js";

export function loadUser(req, res, next) {
  req.user = null;
  const token = req.cookies.token;

  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      res.clearCookie("token");
    }
  }

  res.locals.user = req.user;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Connexion requise" });
  }

  next();
}