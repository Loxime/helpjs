import express from "express";
import cookieParser from "cookie-parser";

import { router as apiRouter } from "./routes/api.routes.js";
import { loadUser } from "./middlewares/auth.js";
import { notFound, errorHandler } from "./middlewares/errors.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(loadUser);

app.use("/api/tickets", apiRouter);

app.use(notFound);
app.use(errorHandler);