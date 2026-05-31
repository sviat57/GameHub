import { Blocks, Brain, Gamepad2, Grid3X3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type GameCategory = 'Arcade' | 'Logic' | 'Memory'
export type GameDifficulty = 'Easy' | 'Medium' | 'Logic'
export type GameStatus = 'Playable'

export type Game = {
  id: 'block-drop' | 'neon-sudoku' | 'neon-snake' | 'smart-cards'
  name: string
  type: string
  category: GameCategory
  route: string
  description: string
  status: GameStatus
  difficulty: GameDifficulty
  techTags: string[]
  codeUrl: string
  accent: string
  icon: LucideIcon
  focus: string
  howToPlay: string[]
}

// TODO: Replace these placeholder code anchors with real GitHub URLs when the
// portfolio repositories are published.
export const games: Game[] = [
  {
    id: 'block-drop',
    name: 'Block Drop',
    type: 'Arcade',
    category: 'Arcade',
    route: '/games/block-drop',
    description:
      'A modern block-stacking arcade game with score, levels, ghost piece, next piece preview and local high score.',
    status: 'Playable',
    difficulty: 'Medium',
    techTags: ['React', 'TypeScript', 'Game Loop', 'localStorage'],
    codeUrl: '#block-drop-code',
    accent: 'from-arcade-mint/80 to-emerald-300/70',
    icon: Blocks,
    focus:
      'Inspired by my original Tetris-style project. Focus: game loop, collision, scoring, keyboard controls, UI polish.',
    howToPlay: [
      'Move and rotate falling blocks to complete horizontal lines.',
      'Use the ghost piece to plan drops and clear multiple lines for bigger scores.',
      'Pause or restart anytime, and chase the saved local high score.',
    ],
  },
  {
    id: 'neon-sudoku',
    name: 'Neon Sudoku',
    type: 'Logic Puzzle',
    category: 'Logic',
    route: '/games/neon-sudoku',
    description:
      'A premium Sudoku puzzle with difficulty levels, pen/pencil mode, auto-notes, hints, timer and mistake checking.',
    status: 'Playable',
    difficulty: 'Logic',
    techTags: ['React', 'TypeScript', 'Solver', 'UI State'],
    codeUrl: '#neon-sudoku-code',
    accent: 'from-cyan-300/70 to-arcade-mint/80',
    icon: Grid3X3,
    focus:
      'Focus: puzzle generation, validation, candidate notes, keyboard-friendly UI.',
    howToPlay: [
      'Choose a difficulty, select a square, then enter values with the keypad or keyboard.',
      'Switch to pencil mode for notes, use quick input for faster solving, and request hints when stuck.',
      'Finish the full valid grid to trigger the victory summary and best-time save.',
    ],
  },
  {
    id: 'neon-snake',
    name: 'Neon Snake',
    type: 'Classic Arcade',
    category: 'Arcade',
    route: '/games/neon-snake',
    description:
      'A glowing grid-based snake game with speed levels, wall modes, score combos, mobile controls and local high score.',
    status: 'Playable',
    difficulty: 'Easy',
    techTags: ['React', 'TypeScript', 'Grid Logic', 'Mobile Controls'],
    codeUrl: '#neon-snake-code',
    accent: 'from-sky-300/75 to-cyan-300/70',
    icon: Gamepad2,
    focus:
      'Focus: grid movement, collision detection, speed scaling, mobile controls.',
    howToPlay: [
      'Guide the snake to food with WASD, arrow keys, swipes or the on-screen controls.',
      'Classic Walls ends a run on edges, while Portal Walls wraps around the board.',
      'Build combos by eating quickly and survive as the speed increases.',
    ],
  },
  {
    id: 'smart-cards',
    name: 'Smart Cards',
    type: 'Memory Game',
    category: 'Memory',
    route: '/games/smart-cards',
    description:
      'A developer-themed card matching game with flip animations, combos, timer, accuracy tracking and best scores.',
    status: 'Playable',
    difficulty: 'Easy',
    techTags: ['React', 'TypeScript', 'Framer Motion', 'localStorage'],
    codeUrl: '#smart-cards-code',
    accent: 'from-teal-300/75 to-lime-300/70',
    icon: Brain,
    focus: 'Focus: state management, animations, matching logic, score tracking.',
    howToPlay: [
      'Start a board, flip two developer-themed cards, and remember their locations.',
      'Matched pairs stay revealed; missed pairs flip back after a short delay.',
      'Finish with fewer moves, faster time, higher accuracy and longer combos.',
    ],
  },
]

export const gameCategories = ['All', 'Arcade', 'Logic', 'Memory'] as const

export type GameFilter = (typeof gameCategories)[number]

export const getGameById = (id: Game['id']) => games.find((game) => game.id === id)
