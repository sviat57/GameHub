import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { PageShell } from './components/shared/PageShell'
import { BlockDropPage } from './pages/BlockDropPage'
import { GamesPage } from './pages/GamesPage'
import { HomePage } from './pages/HomePage'
import { NeonSnakePage } from './pages/NeonSnakePage'
import { NeonSudokuPage } from './pages/NeonSudokuPage'
import { SmartCardsPage } from './pages/SmartCardsPage'

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      return
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.hash])

  return null
}

function AppRoutes() {
  const location = useLocation()

  return (
    <PageShell currentPath={location.pathname}>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/block-drop" element={<BlockDropPage />} />
        <Route path="/games/neon-sudoku" element={<NeonSudokuPage />} />
        <Route path="/games/neon-snake" element={<NeonSnakePage />} />
        <Route path="/games/smart-cards" element={<SmartCardsPage />} />
        <Route path="/games/code-memory" element={<Navigate replace to="/games/smart-cards" />} />
        <Route path="*" element={<Navigate replace to="/games" />} />
      </Routes>
    </PageShell>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
