import express from "express";
import { test, updateUser } from "../controllers/userController.js";
import { verifyUser } from "../config/utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyUser, updateUser);

export default router;
