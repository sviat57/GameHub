import { HomePage } from './pages/HomePage'
import { GamesPage } from './pages/GamesPage'
import { BlockDropPage } from './pages/BlockDropPage'
import { NeonSnakePage } from './pages/NeonSnakePage'
import { NeonSudokuPage } from './pages/NeonSudokuPage'
import { SmartCardsPage } from './pages/SmartCardsPage'
import { PageShell } from './components/shared/PageShell'

const normalizePath = (path: string) => {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }

  return path
}

function App() {
  const currentPath = normalizePath(window.location.pathname)

  const page =
    currentPath === '/' ? (
      <HomePage />
    ) : currentPath === '/games' ? (
      <GamesPage />
    ) : currentPath === '/games/block-drop' ? (
      <BlockDropPage />
    ) : currentPath === '/games/neon-sudoku' ? (
      <NeonSudokuPage />
    ) : currentPath === '/games/neon-snake' ? (
      <NeonSnakePage />
    ) : currentPath === '/games/smart-cards' || currentPath === '/games/code-memory' ? (
      <SmartCardsPage />
    ) : (
      <GamesPage />
    )

  return <PageShell currentPath={currentPath}>{page}</PageShell>
}

export default App
