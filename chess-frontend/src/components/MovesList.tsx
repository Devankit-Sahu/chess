const MovesList = ({ moveList }) => {
  console.log(moveList);
  return (
    <div className="text-white h-full overflow-y-auto">
      <h2>Moves</h2>
      <ul>
        <li className="flex items-center gap-20">
          <span>from</span>
          <span>to</span>
        </li>
        {moveList.map((move, index) => (
          <li className="flex items-center gap-20" key={index}>
            <span>{`${move.from}`}</span>
            <span>{`${move.to}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovesList;
