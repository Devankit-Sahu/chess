import { useParams } from "react-router-dom";
import Board from "./Board";
import { useSocket } from "../context/socketContext";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "./Header";
import { server } from "../config/config";

type PieceType = {
  type: string;
  color: string;
};

type Square = PieceType | null;

const Game = () => {
  const [game, setGame] = useState<GameData | null>(null);
  const { gameId } = useParams<{ gameId: string }>();
  const user = JSON.parse(localStorage.getItem("user") || "{}") || null;
  const [chess, setChess] = useState<Chess | null>(null);
  const [board, setBoard] = useState<Square[][]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PieceType | null>(null);
  const [sourceSquare, setSourceSquare] = useState<string | null>(null);
  const [moves, setMoves] = useState<Array<{ from: string; to: string }>>([]);
  const socket = useSocket();

  const dragStart = (e: React.DragEvent<HTMLDivElement>, piece: PieceType) => {
    if (chess) {
      if (chess.turn() !== (user?._id === game?.playerWhite ? "w" : "b")) {
        toast.error("It's not your turn", { position: "bottom-center" });
        return;
      }
    }
    setDraggedPiece(piece);
    setSourceSquare(
      e.currentTarget.parentElement?.getAttribute("data-square") || null
    );
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetSquare: string) => {
    e.preventDefault();
    if (draggedPiece && sourceSquare && targetSquare && chess) {
      const move = chess.move({ from: sourceSquare, to: targetSquare });
      if (move) {
        if (socket) {
          socket.emit("move", {
            from: move.from,
            to: move.to,
            gameId: gameId,
            userId: user?._id,
          });
        }
        setDraggedPiece(null);
        setSourceSquare(null);
        setBoard(chess.board());
      } else {
        toast.error("Invalid move", { position: "bottom-center" });
      }
    }
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleMove = (data: {
    move: { from: string; to: string };
    fen: string;
  }) => {
    setMoves((prevMoves) => {
      const moveExists = prevMoves.some(
        (m) => m.from === data.move.from && m.to === data.move.to
      );
      if (!moveExists) {
        return [...prevMoves, { from: data.move.from, to: data.move.to }];
      }
      return prevMoves;
    });
    const updatedChess = new Chess(data.fen);
    setChess(updatedChess);
    setBoard(updatedChess.board());
  };

  const handleInvalidMove = (msg: string) => {
    toast.error(msg, { position: "bottom-center" });
  };

  const fetchGame = async (gameId: string) => {
    try {
      const { data } = await axios.get(`${server}/api/game/${gameId}`);
      const updatedChess = new Chess(data.fen);
      setChess(updatedChess);
      setBoard(updatedChess.board());
      setGame(data);
      setMoves(data.moves || []);
    } catch (error) {
      toast.error("Error fetching game data", { position: "bottom-center" });
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchGame(gameId);
    }

    if (socket) {
      socket.on("move", handleMove);
      socket.on("invalid_move", handleInvalidMove);
      socket.on("game_started", ({ message }: { message: string }) => {
        toast.success(message, { position: "bottom-center" });
      });
      socket.emit("reconnect_game", { userId: user?._id });
    }

    return () => {
      if (socket) {
        socket.off("move");
        socket.off("invalid_move");
        socket.off("game_started");
        socket.off("reconnect_game");
      }
    };
  }, [socket, gameId]);

  return (
    <section className="min-h-screen px-4 md:px-8">
      <Header />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center justify-center">
          <Board
            renderedBoard={board}
            onDrop={onDrop}
            allowDrop={allowDrop}
            dragStart={dragStart}
          />
        </div>
        <div className="flex-1 p-4">
          <h1 className="text-lg text-center font-bold mb-2">Moves</h1>
          <div className="flex justify-evenly">
            <span className="capitalize font-bold">from</span>
            <span className="capitalize font-bold">to</span>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-32rem)] md:max-h-[calc(100vh-8rem)] scrollbar-hidden">
            {moves?.length > 0 && (
              <div className="space-y-2">
                {moves.map((move, index) => (
                  <div
                    key={index}
                    className={`flex justify-evenly text-black ${
                      (index + 1) % 2 == 0 ? "bg-gray-400" : "bg-gray-300"
                    }`}
                  >
                    <span>{move.from}</span>
                    <span>{move.to}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game;
