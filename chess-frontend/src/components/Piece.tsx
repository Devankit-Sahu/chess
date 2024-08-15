import React from "react";

interface PieceProps {
  piece: {
    type: string;
    color: string;
  };
  dragStart: (
    e: React.DragEvent<HTMLDivElement>,
    piece: PieceProps["piece"]
  ) => void;
}

const Piece: React.FC<PieceProps> = ({ piece, dragStart }) => {
  if (!piece) return null;

  const getPieceSymbol = (piece: PieceProps["piece"]) => {
    switch (piece.type) {
      case "p":
        return "♙";
      case "r":
        return "♜";
      case "n":
        return "♞";
      case "b":
        return "♝";
      case "q":
        return "♛";
      case "k":
        return "♚";
      default:
        return null;
    }
  };

  return (
    <div
      className={`piece ${
        piece.color === "w" ? "text-white" : "text-black"
      } text-[25px] sm:text-[28px] md:text-[35px]`}
      draggable
      onDragStart={(e) => dragStart(e, piece)}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default Piece;
