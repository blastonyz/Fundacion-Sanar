import Link from "next/link"

interface ServiceCardProps {
  title: string
  description: string
  image: string
  alt: string
}

export function ServiceCard({ title, description, image, alt }: ServiceCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl glass-card">
      <div 
        className="h-40 w-full bg-cover bg-center"
        style={{ backgroundImage: `url("${image}")` }}
        role="img"
        aria-label={alt}
      />
      <div className="flex flex-col gap-2 p-4">
        <p className="text-lg font-bold leading-tight tracking-tight text-foreground">{title}</p>
        <p className="text-base font-normal leading-normal text-muted">{description}</p>
        <div className="flex justify-end pt-2">
          <Link 
            href="#"
            className="flex h-10 min-w-[96px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-4 text-sm font-medium leading-normal text-primary-foreground"
          >
            <span className="truncate">Ver Más</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
