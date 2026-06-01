import type { Piece, Tetromino, TetrominoType } from "./types";

export const TETROMINOES: Record<TetrominoType, Tetromino> = {
  I: {
    type: "I",
    name: "Ion Beam",
    color: "#67e8f9",
    glow: "rgba(103, 232, 249, 0.58)",
    rotations: [
      [1, 5, 9, 13],
      [4, 5, 6, 7]
    ]
  },
  Z: {
    type: "Z",
    name: "Red Shift",
    color: "#fb7185",
    glow: "rgba(251, 113, 133, 0.5)",
    rotations: [
      [4, 5, 9, 10],
      [2, 6, 5, 9]
    ]
  },
  S: {
    type: "S",
    name: "Pulse",
    color: "#5ed29c",
    glow: "rgba(94, 210, 156, 0.56)",
    rotations: [
      [6, 7, 9, 10],
      [1, 5, 6, 10]
    ]
  },
  J: {
    type: "J",
    name: "Vector",
    color: "#60a5fa",
    glow: "rgba(96, 165, 250, 0.52)",
    rotations: [
      [1, 2, 5, 9],
      [0, 4, 5, 6],
      [1, 5, 8, 9],
      [4, 5, 6, 10]
    ]
  },
  L: {
    type: "L",
    name: "Solar",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.5)",
    rotations: [
      [1, 2, 6, 10],
      [5, 6, 7, 9],
      [2, 6, 10, 11],
      [3, 5, 6, 7]
    ]
  },
  T: {
    type: "T",
    name: "Prism",
    color: "#c084fc",
    glow: "rgba(192, 132, 252, 0.5)",
    rotations: [
      [1, 4, 5, 6],
      [1, 5, 6, 9],
      [4, 5, 6, 9],
      [1, 4, 5, 9]
    ]
  },
  O: {
    type: "O",
    name: "Core",
    color: "#fde047",
    glow: "rgba(253, 224, 71, 0.48)",
    rotations: [[1, 2, 5, 6]]
  }
};

export const TETROMINO_TYPES = Object.keys(TETROMINOES) as TetrominoType[];

export function createPiece(type: TetrominoType, id?: string): Piece {
  return {
    id: id ?? `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    rotation: 0,
    x: 3,
    y: 0
  };
}

export function randomTetrominoType(exclude?: TetrominoType): TetrominoType {
  const choices = exclude
    ? TETROMINO_TYPES.filter((type) => type !== exclude)
    : TETROMINO_TYPES;

  return choices[Math.floor(Math.random() * choices.length)];
}
