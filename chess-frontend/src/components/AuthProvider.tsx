// SocketProvider.tsx
import { ReactNode, useState } from "react";
import userContext from "../context/authContext";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  return <userContext.Provider value={user}>{children}</userContext.Provider>;
};

export default AuthProvider;
