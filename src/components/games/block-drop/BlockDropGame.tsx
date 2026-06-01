"use client";

import { motion, useAnimationControls } from "framer-motion";
import { ArrowLeft, BadgeCheck, Keyboard, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GameBoard } from "./GameBoard";
import { GameControls } from "./GameControls";
import { GameOverlay } from "./GameOverlay";
import { GameStats } from "./GameStats";
import { useBlockDropGame } from "./useBlockDropGame";

export function BlockDropGame() {
  const { state, ghostPiece, fallDelay, actions, handleKeyboard } =
    useBlockDropGame();
  const wrapperRef = useRef<HTMLElement>(null);
  const boardControls = useAnimationControls();

  useEffect(() => {
    if (state.shakeId === 0) {
      return;
    }

    const magnitude = state.shakeMagnitude || 4;
    void boardControls.start({
      x: [0, -magnitude, magnitude, -magnitude * 0.6, magnitude * 0.6, 0],
      y: [0, magnitude * 0.5, -magnitude * 0.5, magnitude * 0.35, 0],
      transition: { duration: 0.24, ease: "easeOut" }
    });
  }, [boardControls, state.shakeId, state.shakeMagnitude]);

  const focusGame = () => {
    window.requestAnimationFrame(() => wrapperRef.current?.focus());
  };

  const startGame = () => {
    actions.start();
    focusGame();
  };

  const restartGame = () => {
    actions.restart();
    focusGame();
  };

  const resumeGame = () => {
    actions.togglePause();
    focusGame();
  };

  return (
    <main className="min-h-screen px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
      <section
        aria-label="Block Drop game"
        className="mx-auto max-w-7xl outline-none"
        onKeyDown={handleKeyboard}
        ref={wrapperRef}
        tabIndex={0}
      >
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              className="liquid-button inline-flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-bold text-white"
              to="/games"
              title="Back to Games"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Games</span>
            </Link>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
                  <BadgeCheck size={14} />
                  Python Remake
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                  <Sparkles size={14} />
                  Neon Arcade
                </span>
              </div>
              <h1 className="text-4xl font-black leading-none text-white sm:text-5xl">
                Block Drop
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
                A Python-born arcade project rebuilt as a polished web game.
              </p>
            </div>
          </div>

          <div className="glass-panel hidden rounded-xl px-4 py-3 text-sm text-white/62 md:flex md:items-center md:gap-3">
            <Keyboard className="text-emerald-100" size={20} />
            Focus the board, then use arrows, WASD, Space, P, and R.
          </div>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <motion.div animate={boardControls} className="relative mx-auto w-full">
              <div className="relative mx-auto w-[min(92vw,430px,calc((100dvh-190px)/2))] max-w-full">
                <GameBoard
                  board={state.board}
                  clearFlashes={state.clearFlashes}
                  currentPiece={state.currentPiece}
                  floatingScores={state.floatingScores}
                  ghostPiece={ghostPiece}
                  particles={state.particles}
                />
                <GameOverlay
                  highScore={state.highScore}
                  onRestart={restartGame}
                  onResume={resumeGame}
                  onStart={startGame}
                  score={state.score}
                  status={state.status}
                />
              </div>
            </motion.div>

            <GameControls
              onHardDrop={actions.hardDrop}
              onLeft={actions.moveLeft}
              onRight={actions.moveRight}
              onRotate={actions.rotate}
              onSoftDrop={actions.softDrop}
            />
          </div>

          <GameStats
            fallDelay={fallDelay}
            highScore={state.highScore}
            level={state.level}
            lines={state.lines}
            nextPiece={state.nextPiece}
            onPause={actions.togglePause}
            onRestart={restartGame}
            score={state.score}
            status={state.status}
          />
        </div>
      </section>
    </main>
  );
}
