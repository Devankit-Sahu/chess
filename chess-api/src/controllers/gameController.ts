import { NextFunction, Request, Response } from "express";
import Game from "../models/gameModel";

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { playerWhite, playerBlack, fen } = req.body;
    const game = await Game.create({ playerWhite, playerBlack, fen });
    return res.status(201).json(game);
  } catch (error) {
    return next(error);
  }
};

export const getGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    return res.status(200).json(game);
  } catch (error) {
    return next(error);
  }
};

export const makeMove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { move, player } = req.body;
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    if (game.status !== "ongoing") {
      return res.status(400).json({ message: "Game is already over" });
    }
    game.moves.push({ move, player });
    game.fen = move;
    await game.save();
    return res.status(200).json(game);
  } catch (error) {
    return next(error);
  }
};
