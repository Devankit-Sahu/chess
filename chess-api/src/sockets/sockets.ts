import { Server, Socket } from "socket.io";
import { Chess } from "chess.js";
import Game from "../models/gameModel";

const handleSocketEvents = (io: Server) => {
  const userSocketMap: Map<string, string> = new Map();
  const socketUserMap: Map<string, string> = new Map();
  const ongoingGames: Map<string, any> = new Map();
  const pendingUsers: Set<string> = new Set();

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // handle game reconnection
    socket.on("reconnect_game", async ({ userId }) => {
      console.log(`User reconnected: ${userId}`);
      userSocketMap.set(userId, socket.id);
      socketUserMap.set(socket.id, userId);
    });

    // Handle start_game event
    socket.on("start_game", async ({ userId }) => {
      try {
        userSocketMap.set(userId, socket.id);
        socketUserMap.set(socket.id, userId);

        if (pendingUsers.size == 0) {
          pendingUsers.add(userId);
          // create new game
          const chess = new Chess();
          const game = new Game({ playerWhite: userId, fen: chess.fen() });
          await game.save();
          ongoingGames.set(game._id.toString(), game);
          socket.emit("game_created", { gameId: game._id });
        } else {
          const pendingUserId = Array.from(pendingUsers)[0];
          if (ongoingGames.size > 0) {
            const gameId = Array.from(ongoingGames.values()).map((g) =>
              g.playerWhite.toString() === pendingUserId ? g._id : null
            );

            const game = await Game.findById(gameId);
            if (game) {
              game.playerBlack = userId;
              game.status = "ongoing";
              await game.save();
              ongoingGames.delete(gameId.toString());
              socket.emit("game_created", { gameId: game._id });
            }
          }
          const pendingUserSocketId = userSocketMap.get(
            pendingUserId.toString()
          );

          if (pendingUserSocketId) {
            io.to(pendingUserSocketId).emit("game_started", {
              message: "Game started",
            });
          } else {
            console.error(
              `Socket ID for pending user ${pendingUserId} not found`
            );
            socket.emit("error", "Unable to start the game");
          }
          pendingUsers.delete(pendingUserId);
        }
      } catch (error) {
        socket.emit("error", error);
      }
    });

    // Handle move event
    socket.on("move", async ({ from, to, gameId, userId }) => {
      try {
        const game = await Game.findById(gameId);
        if (!game) {
          socket.emit("invalid_move", "Game not found");
          return;
        }

        const chessInstance = new Chess(game.fen);
        const result = chessInstance.move({ from, to });

        if (result) {
          game.fen = chessInstance.fen();
          game.moves.push({
            from,
            to,
            player: userId,
          });
          await game.save();

          io.emit("move", {
            move: { from, to },
            fen: game.fen,
          });
        }
      } catch (error) {
        console.error("Error handling move:", error);
        socket.emit("invalid_move", "Invalid move");
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      const userId = socketUserMap.get(socket.id);
      if (userId) {
        userSocketMap.delete(userId);
        socketUserMap.delete(socket.id);
        pendingUsers.delete(userId);
      }
    });
  });
};

export default handleSocketEvents;
