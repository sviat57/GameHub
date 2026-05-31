import { AboutSection } from '../components/AboutSection'
import { CodeLinksNotice } from '../components/shared/CodeLinksNotice'
import { FinalCtaSection } from '../components/FinalCtaSection'
import { GameShowcase } from '../components/GameShowcase'
import { HeroSection } from '../components/HeroSection'
import { TechStackSection } from '../components/TechStackSection'

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <GameShowcase />
      <AboutSection />
      <TechStackSection />
      <section id="projects" className="relative z-10 px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <CodeLinksNotice />
        </div>
      </section>
      <FinalCtaSection />
    </main>
  )
}
