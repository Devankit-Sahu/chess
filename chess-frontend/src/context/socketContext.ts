import { createContext, useContext } from "react";

const socketContext = createContext(null);

export const useSocket = () => {
  return useContext(socketContext);
};

export default socketContext;
