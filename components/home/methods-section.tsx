import { Flower2, Brain, Sparkles, Heart } from "lucide-react"

const methods = [
  {
    icon: Flower2,
    title: "Herbolaria",
    description: "Sanación con plantas"
  },
  {
    icon: Brain,
    title: "Meditación",
    description: "Paz y mindfulness"
  },
  {
    icon: Sparkles,
    title: "Terapia Floral",
    description: "Equilibrio emocional"
  },
  {
    icon: Heart,
    title: "Reiki",
    description: "Energía universal"
  }
]

export function MethodsSection() {
  return (
    <>
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-tight px-4 pb-3 pt-8">
        Nuestros Métodos
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {methods.map((method) => (
          <div 
            key={method.title}
            className="flex flex-1 gap-3 rounded-lg border border-accent/50 bg-secondary/60 p-4 flex-col"
          >
            <method.icon className="size-8 text-primary" />
            <div className="flex flex-col gap-1">
              <h3 className="text-foreground text-base font-bold leading-tight">{method.title}</h3>
              <p className="text-muted text-sm font-normal leading-normal">{method.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
