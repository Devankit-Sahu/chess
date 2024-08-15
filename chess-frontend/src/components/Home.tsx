import { useSocket } from "../context/socketContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";

const Home = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const userItem = localStorage.getItem("user");
  const user = userItem ? JSON.parse(userItem) : null;

  const startGameHandler = () => {
    if (!user) {
      navigate("/login");
    } else {
      if (socket) {
        socket.emit("start_game", { userId: user._id });
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("game_created", ({ gameId }: { gameId: string }) => {
        navigate(`/game/${gameId}`);
      });
    }
    return () => {
      if (socket) {
        socket.off("game_created");
      }
    };
  }, [socket]);

  return (
    <main className="min-h-screen w-full max-w-7xl mx-auto">
      <Header />
      <div className="flex h-full">
        <div className="w-1/2">{/* Add image here */}</div>

        <div className="w-1/2">
          <button onClick={startGameHandler}>Start Game</button>
        </div>
      </div>
    </main>
  );
};

export default Home;
