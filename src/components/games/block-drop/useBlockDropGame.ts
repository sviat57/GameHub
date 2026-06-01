"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { createPiece, randomTetrominoType, TETROMINOES } from "./tetrominoes";
import {
  BOARD_COLUMNS,
  BOARD_ROWS,
  type Board,
  type FloatingScore,
  type GameAction,
  type GameSnapshot,
  type Particle,
  type Piece
} from "./types";

const HIGH_SCORE_KEY = "block-drop-high-score";
const SCORE_BY_LINES: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800
};

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLUMNS }, () => null)
  );
}

function getPieceCells(piece: Piece) {
  const shape = TETROMINOES[piece.type].rotations[
    piece.rotation % TETROMINOES[piece.type].rotations.length
  ];

  return shape.map((index) => ({
    x: piece.x + (index % 4),
    y: piece.y + Math.floor(index / 4)
  }));
}

function canPlace(board: Board, piece: Piece): boolean {
  return getPieceCells(piece).every(({ x, y }) => {
    if (x < 0 || x >= BOARD_COLUMNS || y >= BOARD_ROWS) {
      return false;
    }

    if (y < 0) {
      return true;
    }

    return board[y][x] === null;
  });
}

function createInitialState(highScore = 0, randomizePieces = false): GameSnapshot {
  const currentType = randomizePieces ? randomTetrominoType() : "T";
  const nextType = randomizePieces ? randomTetrominoType(currentType) : "I";

  return {
    board: createEmptyBoard(),
    currentPiece: createPiece(
      currentType,
      randomizePieces ? undefined : "idle-current-piece"
    ),
    nextPiece: createPiece(nextType, randomizePieces ? undefined : "idle-next-piece"),
    status: "idle",
    score: 0,
    highScore,
    level: 1,
    lines: 0,
    particles: [],
    floatingScores: [],
    clearFlashes: [],
    shakeId: 0,
    shakeMagnitude: 0
  };
}

function getFallDelay(level: number) {
  return Math.max(95, 680 - (level - 1) * 42);
}

function getGhostPiece(board: Board, piece: Piece): Piece {
  let ghost = { ...piece };

  while (canPlace(board, { ...ghost, y: ghost.y + 1 })) {
    ghost = { ...ghost, y: ghost.y + 1 };
  }

  return ghost;
}

function lockPiece(board: Board, piece: Piece) {
  const nextBoard = board.map((row) => [...row]);
  const lockedAt = Date.now();
  let lockedAboveTop = false;

  for (const { x, y } of getPieceCells(piece)) {
    if (y < 0) {
      lockedAboveTop = true;
      continue;
    }

    if (y < BOARD_ROWS && x >= 0 && x < BOARD_COLUMNS) {
      nextBoard[y][x] = {
        type: piece.type,
        lockedAt
      };
    }
  }

  return { board: nextBoard, lockedAboveTop };
}

function clearRows(board: Board) {
  const fullRows: number[] = [];
  const remainingRows: Board = [];

  board.forEach((row, rowIndex) => {
    if (row.every(Boolean)) {
      fullRows.push(rowIndex);
    } else {
      remainingRows.push(row);
    }
  });

  if (fullRows.length === 0) {
    return { board, fullRows };
  }

  const emptyRows = Array.from({ length: fullRows.length }, () =>
    Array.from({ length: BOARD_COLUMNS }, () => null)
  );

  return {
    board: [...emptyRows, ...remainingRows],
    fullRows
  };
}

function createParticles(fullRows: number[], boardBeforeClear: Board): Particle[] {
  const now = Date.now();
  const particles: Particle[] = [];

  for (const row of fullRows) {
    for (let col = 0; col < BOARD_COLUMNS; col += 1) {
      const cell = boardBeforeClear[row][col];
      if (!cell) {
        continue;
      }

      const tetromino = TETROMINOES[cell.type];

      for (let i = 0; i < 4; i += 1) {
        particles.push({
          id: `${now}-${row}-${col}-${i}-${Math.random().toString(36).slice(2)}`,
          x: ((col + 0.24 + Math.random() * 0.52) / BOARD_COLUMNS) * 100,
          y: ((row + 0.22 + Math.random() * 0.56) / BOARD_ROWS) * 100,
          dx: Math.round((Math.random() - 0.5) * 112),
          dy: Math.round(-34 - Math.random() * 84),
          size: 4 + Math.random() * 6,
          color: tetromino.color,
          createdAt: now,
          duration: 680 + Math.random() * 320
        });
      }
    }
  }

  return particles;
}

function createFloatingScore(fullRows: number[], points: number): FloatingScore {
  const middleRow = fullRows[Math.floor(fullRows.length / 2)] ?? 10;
  const isBlockDrop = fullRows.length === 4;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    x: 50,
    y: ((middleRow + 0.5) / BOARD_ROWS) * 100,
    text: isBlockDrop ? `BLOCK DROP! +${points}` : `+${points}`,
    createdAt: Date.now()
  };
}

function commitPiece(
  state: GameSnapshot,
  piece: Piece,
  options: { hardDropDistance?: number } = {}
): GameSnapshot {
  const { board: boardWithPiece, lockedAboveTop } = lockPiece(state.board, piece);
  const { board: boardAfterClear, fullRows } = clearRows(boardWithPiece);
  const lineCount = fullRows.length;
  const linePoints = SCORE_BY_LINES[lineCount] ?? 0;
  const hardDropPoints = options.hardDropDistance
    ? Math.max(0, options.hardDropDistance * 2)
    : 0;
  const nextScore = state.score + linePoints + hardDropPoints;
  const nextLines = state.lines + lineCount;
  const nextLevel = Math.floor(nextLines / 10) + 1;
  const newCurrentPiece = {
    ...state.nextPiece,
    id: `${state.nextPiece.type}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`,
    x: 3,
    y: 0,
    rotation: 0
  };
  const newNextPiece = createPiece(randomTetrominoType(newCurrentPiece.type));
  const cannotSpawn = !canPlace(boardAfterClear, newCurrentPiece);
  const isGameOver = lockedAboveTop || cannotSpawn;
  const now = Date.now();
  const particles = lineCount > 0 ? createParticles(fullRows, boardWithPiece) : [];
  const floatingScores =
    lineCount > 0 ? [createFloatingScore(fullRows, linePoints)] : [];
  const clearFlashes = fullRows.map((row) => ({
    id: `${now}-${row}`,
    row,
    createdAt: now
  }));
  const shakeMagnitude =
    lineCount >= 4 ? 8 : lineCount >= 2 ? 5 : options.hardDropDistance ? 4 : 0;

  return {
    ...state,
    board: boardAfterClear,
    currentPiece: newCurrentPiece,
    nextPiece: newNextPiece,
    status: isGameOver ? "gameOver" : state.status,
    score: nextScore,
    highScore: Math.max(state.highScore, nextScore),
    level: nextLevel,
    lines: nextLines,
    particles: [...state.particles, ...particles],
    floatingScores: [...state.floatingScores, ...floatingScores],
    clearFlashes: [...state.clearFlashes, ...clearFlashes],
    shakeId: shakeMagnitude > 0 ? state.shakeId + 1 : state.shakeId,
    shakeMagnitude
  };
}

function movePiece(state: GameSnapshot, dx: -1 | 1): GameSnapshot {
  const moved = { ...state.currentPiece, x: state.currentPiece.x + dx };

  if (!canPlace(state.board, moved)) {
    return state;
  }

  return { ...state, currentPiece: moved };
}

function softDrop(state: GameSnapshot): GameSnapshot {
  const moved = { ...state.currentPiece, y: state.currentPiece.y + 1 };

  if (canPlace(state.board, moved)) {
    return { ...state, currentPiece: moved };
  }

  return commitPiece(state, state.currentPiece);
}

function hardDrop(state: GameSnapshot): GameSnapshot {
  const ghostPiece = getGhostPiece(state.board, state.currentPiece);
  const distance = ghostPiece.y - state.currentPiece.y;

  return commitPiece(state, ghostPiece, { hardDropDistance: distance });
}

function rotatePiece(state: GameSnapshot): GameSnapshot {
  const piece = state.currentPiece;
  const nextRotation =
    (piece.rotation + 1) % TETROMINOES[piece.type].rotations.length;
  const wallKicks = [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: -1 }
  ];

  for (const kick of wallKicks) {
    const rotated = {
      ...piece,
      rotation: nextRotation,
      x: piece.x + kick.x,
      y: piece.y + kick.y
    };

    if (canPlace(state.board, rotated)) {
      return { ...state, currentPiece: rotated };
    }
  }

  return state;
}

function reducer(state: GameSnapshot, action: GameAction): GameSnapshot {
  if (action.type === "LOAD_HIGH_SCORE") {
    return {
      ...state,
      highScore: Math.max(state.highScore, action.value)
    };
  }

  if (action.type === "START" || action.type === "RESTART") {
    return {
      ...createInitialState(state.highScore, true),
      status: "playing"
    };
  }

  if (action.type === "TOGGLE_PAUSE") {
    if (state.status === "playing") {
      return { ...state, status: "paused" };
    }

    if (state.status === "paused") {
      return { ...state, status: "playing" };
    }

    return state;
  }

  if (action.type === "PRUNE_EFFECTS") {
    return {
      ...state,
      particles: state.particles.filter(
        (particle) => action.now - particle.createdAt < particle.duration
      ),
      floatingScores: state.floatingScores.filter(
        (score) => action.now - score.createdAt < 1100
      ),
      clearFlashes: state.clearFlashes.filter(
        (flash) => action.now - flash.createdAt < 240
      )
    };
  }

  if (state.status !== "playing") {
    return state;
  }

  if (action.type === "MOVE") {
    return movePiece(state, action.dx);
  }

  if (action.type === "SOFT_DROP" || action.type === "TICK") {
    return softDrop(state);
  }

  if (action.type === "HARD_DROP") {
    return hardDrop(state);
  }

  if (action.type === "ROTATE") {
    return rotatePiece(state);
  }

  return state;
}

export function useBlockDropGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    createInitialState()
  );
  const fallAccumulator = useRef(0);

  useEffect(() => {
    const stored = window.localStorage.getItem(HIGH_SCORE_KEY);
    const parsed = stored ? Number.parseInt(stored, 10) : 0;

    if (Number.isFinite(parsed)) {
      dispatch({ type: "LOAD_HIGH_SCORE", value: parsed });
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(HIGH_SCORE_KEY, String(state.highScore));
  }, [state.highScore]);

  useEffect(() => {
    fallAccumulator.current = 0;
  }, [state.currentPiece.id, state.status]);

  useEffect(() => {
    if (state.status !== "playing") {
      return;
    }

    let frameId = 0;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      fallAccumulator.current += delta;

      if (fallAccumulator.current >= getFallDelay(state.level)) {
        fallAccumulator.current = 0;
        dispatch({ type: "TICK" });
      }

      frameId = window.requestAnimationFrame(loop);
    };

    frameId = window.requestAnimationFrame(loop);

    return () => window.cancelAnimationFrame(frameId);
  }, [state.level, state.status]);

  useEffect(() => {
    if (
      state.particles.length === 0 &&
      state.floatingScores.length === 0 &&
      state.clearFlashes.length === 0
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: "PRUNE_EFFECTS", now: Date.now() });
    }, 120);

    return () => window.clearInterval(intervalId);
  }, [
    state.clearFlashes.length,
    state.floatingScores.length,
    state.particles.length
  ]);

  const actions = useMemo(
    () => ({
      start: () => dispatch({ type: "START" }),
      restart: () => dispatch({ type: "RESTART" }),
      togglePause: () => dispatch({ type: "TOGGLE_PAUSE" }),
      moveLeft: () => dispatch({ type: "MOVE", dx: -1 }),
      moveRight: () => dispatch({ type: "MOVE", dx: 1 }),
      softDrop: () => dispatch({ type: "SOFT_DROP" }),
      hardDrop: () => dispatch({ type: "HARD_DROP" }),
      rotate: () => dispatch({ type: "ROTATE" })
    }),
    []
  );

  const ghostPiece = useMemo(
    () => getGhostPiece(state.board, state.currentPiece),
    [state.board, state.currentPiece]
  );

  const fallDelay = getFallDelay(state.level);

  const handleKeyboard = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const key = event.key.toLowerCase();
      const handledKeys = [
        "arrowleft",
        "a",
        "arrowright",
        "d",
        "arrowdown",
        "s",
        "arrowup",
        "w",
        " ",
        "p",
        "r"
      ];

      if (!handledKeys.includes(key)) {
        return;
      }

      event.preventDefault();

      if (key === "arrowleft" || key === "a") {
        actions.moveLeft();
      }

      if (key === "arrowright" || key === "d") {
        actions.moveRight();
      }

      if (key === "arrowdown" || key === "s") {
        actions.softDrop();
      }

      if (key === "arrowup" || key === "w") {
        actions.rotate();
      }

      if (key === " ") {
        if (state.status === "idle" || state.status === "gameOver") {
          actions.restart();
        } else {
          actions.hardDrop();
        }
      }

      if (key === "p") {
        actions.togglePause();
      }

      if (key === "r") {
        actions.restart();
      }
    },
    [actions, state.status]
  );

  return {
    state,
    ghostPiece,
    fallDelay,
    actions,
    handleKeyboard
  };
}
