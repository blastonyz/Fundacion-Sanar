import Image from "next/image"

const teamMembers = [
  {
    name: "Anaïs Varela",
    role: "Fundadora",
    description: "Especialista en herbolaria y meditación.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA6LaVCgBxMxeUSJ8Bxys-jNwplfS5F1Bbh0gocrJ2l8m1hUT0aiv2DuRnkDXxeRyP_wxUW2H849oyDebade4fXsSG3MObjZhxpGNfJe6WYCVFGsieQS010vAPusRQMJGrFXyIlF1aaTBll2Lk-bWUMlO0mo1jru6O5YXoYVokHKZU73RtufAKkk5mWoVFHdG1rQ9jmLq1kI2Ng_SKWaWnoukncfh9tDaO4gYrliSCpiJd0m32HvdrcIdUCKgxubOH1I2UiMxc5sE"
  },
  {
    name: "Marcos Ríos",
    role: "Terapeuta Principal",
    description: "Experto en terapia holística y reiki.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBmV43g4I7Mq-E90Fz8IfcaGXfUz-QNwJnhZh32WcxzhQaOZG_f5sqfC536V9phsRBowQz-DVa3ZCW-KRD3QLMu9NrEC4whLd9hxF-uV3ICWGbIS3oNwNSHAa6qZSwgbAzEGjgbTMoaYHPhHUI2EiICyicBnLuVLG4_QI5xE9EEhYteZaCm3ZjF35noIYP0CwnPk0FjDjJUy4q6gjpsboR-lhQ3S-2ewvQ827MKktpHlcn1zNnndzDSCWJ8sBFlTRY37pIafIS2hs"
  },
  {
    name: "Sofía Méndez",
    role: "Coordinadora",
    description: "Encargada de comunidad y eventos.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCxHDAhXiGf1vL6vvpdm2-IVmx2k4uj6qaM8iamr5rMCqOEpATlx_S3pB6LVc21qUBeJwP3c3t99b_6v1pIkK4DE2pbu_ICUgklMgCD4f0HYlmmV0FC2NrFF3-cpgoxFfzjiZdSyhQRNI-OY_vX-WueKFCYMTEWd7qlVzaw-aVJx9lYM9--_Nkk9nuzTTazC11t7XZK5IDo9YyLAEHGHGOMFFLdPhfu1Tqo6kc1zjIYMmkE2xdXr1_HXyrreZOXXHzkRUXAXoxdRE"
  },
  {
    name: "Javier Luna",
    role: "Guía Espiritual",
    description: "Maestro de yoga y retiros espirituales.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ4f8wmDuscdrCAUnEcPVEygTvrX1edDnZJy-_j9j_EmiVw0s4ijC7h7dzXEIcDbtI94bTZPCwlN6jdcRh9fKxYstcfwZEYgFrVuP849mpDvUcNBB1qdtYvrc8dPrW-HqVmrS7cifkqP_mTiDYEsDPAYzDpIdV3Au1HLb6EKp3ijXKT7TTm0ov44qhtB9nbCFMmad7pL3BXCp46xSZ2J5PafGV5nvwygiLCvMS519WBxSY6B-yLsSqmtA_uCQtZK0EW_WTMcjdBaU"
  }
]

export function TeamSection() {
  return (
    <div className="flex flex-col gap-4 py-6">
      <h3 className="text-foreground text-2xl font-bold leading-tight px-4">Conoce a Nuestro Equipo</h3>
      <div className="relative w-full">
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
          {teamMembers.map((member) => (
            <div 
              key={member.name}
              className="flex-shrink-0 w-[160px] flex flex-col items-center p-4 rounded-xl glass-bg"
            >
              <Image
                className="h-24 w-24 rounded-full object-cover border-2 border-primary/50"
                alt={`Portrait of ${member.name}`}
                src={member.image || "/placeholder.svg"}
                width={96}
                height={96}
              />
              <p className="text-foreground text-base font-bold mt-3 text-center">{member.name}</p>
              <p className="text-muted text-xs text-center">{member.role}</p>
              <p className="text-foreground/60 text-xs mt-1 text-center">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
