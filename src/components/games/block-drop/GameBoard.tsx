import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { TETROMINOES } from "./tetrominoes";
import {
  BOARD_COLUMNS,
  BOARD_ROWS,
  type Board,
  type ClearFlash,
  type FloatingScore,
  type Particle,
  type Piece,
  type TetrominoType
} from "./types";

type BoardCellVisual = {
  type: TetrominoType;
  state: "active" | "locked" | "ghost";
};

type GameBoardProps = {
  board: Board;
  currentPiece: Piece;
  ghostPiece: Piece;
  particles: Particle[];
  floatingScores: FloatingScore[];
  clearFlashes: ClearFlash[];
};

function getPieceCells(piece: Piece) {
  const shape = TETROMINOES[piece.type].rotations[
    piece.rotation % TETROMINOES[piece.type].rotations.length
  ];

  return shape.map((index) => ({
    x: piece.x + (index % 4),
    y: piece.y + Math.floor(index / 4)
  }));
}

function getVisualForCell(
  board: Board,
  currentPiece: Piece,
  ghostPiece: Piece,
  x: number,
  y: number
): BoardCellVisual | null {
  const active = getPieceCells(currentPiece).some(
    (cell) => cell.x === x && cell.y === y
  );

  if (active) {
    return {
      type: currentPiece.type,
      state: "active"
    };
  }

  const locked = board[y][x];
  if (locked) {
    return {
      type: locked.type,
      state: "locked"
    };
  }

  const ghost = getPieceCells(ghostPiece).some(
    (cell) => cell.x === x && cell.y === y
  );

  if (ghost) {
    return {
      type: ghostPiece.type,
      state: "ghost"
    };
  }

  return null;
}

export function GameBoard({
  board,
  currentPiece,
  ghostPiece,
  particles,
  floatingScores,
  clearFlashes
}: GameBoardProps) {
  const cells = Array.from({ length: BOARD_COLUMNS * BOARD_ROWS }, (_, index) => {
    const x = index % BOARD_COLUMNS;
    const y = Math.floor(index / BOARD_COLUMNS);
    return {
      id: `${x}-${y}`,
      x,
      y,
      visual: getVisualForCell(board, currentPiece, ghostPiece, x, y)
    };
  });

  return (
    <div className="relative mx-auto aspect-[10/20] w-full overflow-hidden rounded-2xl border border-emerald-300/25 bg-slate-950/82 p-2 shadow-[0_0_60px_rgba(94,210,156,0.16)] sm:p-3">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(94,210,156,0.08),transparent_30%,rgba(103,232,249,0.06))]" />
      <div className="relative grid size-full grid-cols-[repeat(10,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] overflow-hidden rounded-xl border border-white/10 bg-black/28">
        {cells.map((cell) => {
          const tetromino = cell.visual ? TETROMINOES[cell.visual.type] : null;
          return (
            <div
              className="relative border border-white/[0.045] bg-white/[0.018]"
              key={cell.id}
            >
              {cell.visual && tetromino ? (
                <motion.div
                  className={`absolute inset-[7%] rounded-md ${
                    cell.visual.state === "ghost" ? "ghost-cell" : "block-cell"
                  }`}
                  initial={
                    cell.visual.state === "locked"
                      ? { scale: 0.92, opacity: 0.86 }
                      : false
                  }
                  animate={{ scale: 1, opacity: cell.visual.state === "ghost" ? 0.34 : 1 }}
                  transition={{ duration: 0.12 }}
                  style={
                    {
                      "--block-color": tetromino.color,
                      "--block-glow": tetromino.glow
                    } as CSSProperties
                  }
                />
              ) : null}
            </div>
          );
        })}

        {clearFlashes.map((flash) => (
          <div
            className="line-clear-flash pointer-events-none absolute left-0 z-20 h-[5%] w-full bg-white shadow-[0_0_34px_rgba(255,255,255,0.68)]"
            key={flash.id}
            style={{ top: `${(flash.row / BOARD_ROWS) * 100}%` }}
          />
        ))}

        {particles.map((particle) => (
          <span
            className="particle-burst pointer-events-none absolute z-30 rounded-full"
            key={particle.id}
            style={
              {
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                background: particle.color,
                boxShadow: `0 0 16px ${particle.color}`,
                "--dx": `${particle.dx}px`,
                "--dy": `${particle.dy}px`,
                "--duration": `${particle.duration}ms`
              } as CSSProperties
            }
          />
        ))}

        {floatingScores.map((score) => (
          <div
            className="floating-score pointer-events-none absolute z-40 whitespace-nowrap rounded-full border border-emerald-200/30 bg-slate-950/78 px-3 py-1 text-sm font-black uppercase tracking-[0.12em] text-emerald-100 shadow-[0_0_26px_rgba(94,210,156,0.28)] sm:text-base"
            key={score.id}
            style={{
              left: `${score.x}%`,
              top: `${score.y}%`
            }}
          >
            {score.text}
          </div>
        ))}
      </div>
    </div>
  );
}
