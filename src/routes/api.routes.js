import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";

export const router = Router();

router.use(requireAuth);