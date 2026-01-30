import { PageHeader } from "@/components/page-header"
import { AboutHero } from "@/components/nosotros/about-hero"
import { AboutAccordions } from "@/components/nosotros/about-accordions"
import { TeamSection } from "@/components/nosotros/team-section"

export default function NosotrosPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <PageHeader title="Nosotros" />
      <main>
        <AboutHero />
        <h1 className="text-foreground tracking-tight text-[32px] font-bold leading-tight px-4 text-left pb-2 pt-4">
          Fundación S.A.N.A.R.
        </h1>
        <p className="text-foreground/80 text-base font-normal leading-normal pb-3 pt-1 px-4">
          Un breve párrafo de bienvenida que resume el propósito de la fundación y su enfoque en la sanación alternativa con métodos naturales y ancestrales para el bienestar integral.
        </p>
        <AboutAccordions />
        <TeamSection />
      </main>
      <div className="h-10" />
    </div>
  )
}
