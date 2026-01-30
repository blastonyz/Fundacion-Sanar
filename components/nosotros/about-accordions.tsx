"use client"

import { ChevronDown } from "lucide-react"

const accordionItems = [
  {
    title: "Nuestra Historia",
    content: "Un resumen del origen y la trayectoria de la fundación, destacando los momentos clave que nos han llevado a ser un referente en sanación natural.",
    defaultOpen: true
  },
  {
    title: "Misión",
    content: "Nuestra misión es guiar a las personas en su camino hacia la sanación y el equilibrio, utilizando terapias alternativas y conocimientos ancestrales.",
    defaultOpen: false
  },
  {
    title: "Visión",
    content: "Ser una comunidad global de bienestar, reconocida por promover un estilo de vida consciente y en armonía con la naturaleza y el ser.",
    defaultOpen: false
  },
  {
    title: "Valores",
    content: "Empatía, respeto por la naturaleza, integridad, y compromiso con el crecimiento personal y colectivo de nuestra comunidad.",
    defaultOpen: false
  }
]

export function AboutAccordions() {
  return (
    <div className="flex flex-col p-4 gap-3">
      {accordionItems.map((item) => (
        <details 
          key={item.title}
          className="flex flex-col rounded-xl glass-bg px-4 py-2 group"
          open={item.defaultOpen}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-2">
            <p className="text-foreground text-sm font-medium leading-normal">{item.title}</p>
            <div className="text-foreground group-open:rotate-180 transition-transform">
              <ChevronDown className="size-5" />
            </div>
          </summary>
          <p className="text-muted text-sm font-normal leading-normal pb-2">{item.content}</p>
        </details>
      ))}
    </div>
  )
}
