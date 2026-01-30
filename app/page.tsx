import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { MissionSection } from "@/components/home/mission-section"
import { MethodsSection } from "@/components/home/methods-section"

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <MissionSection />
        <MethodsSection />
      </main>
      <Footer />
    </div>
  )
}
