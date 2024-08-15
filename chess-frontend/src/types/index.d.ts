declare interface Form {
  username?: string;
  email: string;
  password: string;
}

declare interface GameData {
  playerWhite: string;
  playerBlack: string;
  fen: string;
  _id: string;
  moves: Array<{ from: string; to: string }>;
}
