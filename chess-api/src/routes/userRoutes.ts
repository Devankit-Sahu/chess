import express from "express";
import { getUserById, login } from "../controllers/userController";

const router = express.Router();

router.post("/login", login);
router.get("/:id", getUserById);

export default router;
