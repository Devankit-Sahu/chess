import "./App.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";
import SocketProvider from "./components/SocketProvider";
import Login from "./components/Login";
import Signup from "./components/Signup";

const App = () => {
  return (
    <div className="h-screen ">
      <Toaster />
      <BrowserRouter>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:gameId" element={<Game />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
