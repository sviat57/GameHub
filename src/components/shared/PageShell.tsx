import type { ReactNode } from 'react'
import { Background } from '../Background'
import { Footer } from '../Footer'
import { Header } from '../Header'

type PageShellProps = {
  children: ReactNode
  currentPath: string
}

export function PageShell({ children, currentPath }: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-arcade-black text-white">
      <Background />
      <Header currentPath={currentPath} />
      {children}
      <Footer />
    </div>
  )
}
