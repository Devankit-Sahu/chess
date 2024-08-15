import Piece from "./Piece";

const Board = ({ renderedBoard, onDrop, allowDrop, dragStart }) => {
  return (
    <div>
      {renderedBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((square, colIndex) => {
            const squareId = `${String.fromCharCode(97 + colIndex)}${
              8 - rowIndex
            }`;
            return (
              <div
                key={colIndex}
                data-square={squareId}
                className={`square h-10 sm:h-12 md:h-16 w-10 sm:w-12 md:w-16 flex items-center justify-center select-none ${
                  (rowIndex + colIndex) % 2 === 0
                    ? "bg-[#b58863]"
                    : "bg-[#f0d9b5]"
                }`}
                onDrop={(e) => onDrop(e, squareId)}
                onDragOver={allowDrop}
              >
                {square && <Piece piece={square} dragStart={dragStart} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
