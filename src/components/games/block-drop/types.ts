export const BOARD_COLUMNS = 10;
export const BOARD_ROWS = 20;

export type TetrominoType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

export type GameStatus = "idle" | "playing" | "paused" | "gameOver";

export type BoardCell = {
  type: TetrominoType;
  lockedAt: number;
};

export type Board = Array<Array<BoardCell | null>>;

export type Piece = {
  id: string;
  type: TetrominoType;
  rotation: number;
  x: number;
  y: number;
};

export type Tetromino = {
  type: TetrominoType;
  name: string;
  color: string;
  glow: string;
  rotations: number[][];
};

export type Particle = {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  createdAt: number;
  duration: number;
};

export type FloatingScore = {
  id: string;
  x: number;
  y: number;
  text: string;
  createdAt: number;
};

export type ClearFlash = {
  id: string;
  row: number;
  createdAt: number;
};

export type GameSnapshot = {
  board: Board;
  currentPiece: Piece;
  nextPiece: Piece;
  status: GameStatus;
  score: number;
  highScore: number;
  level: number;
  lines: number;
  particles: Particle[];
  floatingScores: FloatingScore[];
  clearFlashes: ClearFlash[];
  shakeId: number;
  shakeMagnitude: number;
};

export type GameAction =
  | { type: "LOAD_HIGH_SCORE"; value: number }
  | { type: "START" }
  | { type: "RESTART" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "MOVE"; dx: -1 | 1 }
  | { type: "SOFT_DROP" }
  | { type: "HARD_DROP" }
  | { type: "ROTATE" }
  | { type: "TICK" }
  | { type: "PRUNE_EFFECTS"; now: number };
