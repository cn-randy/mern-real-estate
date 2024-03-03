import express from "express";
import { google, signin, signup } from "../controllers/authController.js";

const router = express.Router();

export default router;

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
