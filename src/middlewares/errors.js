export function notFound(req, res) {
  return res.status(404).json({
    error: "Route introuvable",
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "JSON invalide",
    });
  }

  const status =
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status < 600
      ? err.status
      : 500;

  return res.status(status).json({
    error: status === 500
      ? "Erreur du serveur"
      : err.message,
  });
}