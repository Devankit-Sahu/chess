import express, { Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { config } from "dotenv";
import connectToDb from "./config/dbconfig";
import userRoutes from "./routes/userRoutes";
import gameRoutes from "./routes/gameRoutes";
import cors from "cors";
import handleSocketEvents from "./sockets/sockets";

config();

const PORT: number = Number(process.env.PORT) || 5000;
const DBURI = process.env.MONGO_URI as string;
const DBNAME = process.env.DBNAME as string;

connectToDb(DBURI, DBNAME);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL as string],
  },
});
app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);

// handle socket events
handleSocketEvents(io);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the chess API!!!");
});

httpServer.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
