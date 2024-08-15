import { ReactNode, useMemo } from "react";
import { io } from "socket.io-client";
import socketContext from "../context/socketContext";
import { server } from "../config/config";

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useMemo(() => io(server), []);
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};

export default SocketProvider;
