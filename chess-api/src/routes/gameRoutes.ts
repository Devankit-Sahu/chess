import express from "express";
import { getGame } from "../controllers/gameController";

const router = express.Router();

router.get("/:gameId", getGame);

export default router;
