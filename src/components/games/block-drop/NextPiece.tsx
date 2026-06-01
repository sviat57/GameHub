import type { CSSProperties } from "react";
import { TETROMINOES } from "./tetrominoes";
import type { Piece } from "./types";

type NextPieceProps = {
  piece: Piece;
};

export function NextPiece({ piece }: NextPieceProps) {
  const tetromino = TETROMINOES[piece.type];
  const shape = tetromino.rotations[0];

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
          Next Piece
        </p>
        <p className="text-xs font-semibold text-emerald-100/80">
          {tetromino.name}
        </p>
      </div>
      <div className="mx-auto grid size-28 grid-cols-4 grid-rows-4 gap-1 rounded-lg border border-white/[0.07] bg-black/22 p-2">
        {Array.from({ length: 16 }, (_, index) => {
          const active = shape.includes(index);
          return (
            <div
              className={`rounded-sm border ${
                active
                  ? "block-cell border-white/40"
                  : "border-white/[0.045] bg-white/[0.018]"
              }`}
              key={index}
              style={
                active
                  ? ({
                      "--block-color": tetromino.color,
                      "--block-glow": tetromino.glow
                    } as CSSProperties)
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
