import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    playerWhite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    playerBlack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    moves: [
      {
        from: { type: String, default: null },
        to: { type: String, default: null },
        player: { type: mongoose.Schema.Types.ObjectId, default: null },
      },
    ],
    status: {
      type: String,
      enum: ["created", "ongoing", "won", "lost", "draw","gameover"],
      default: "created",
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fen: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
