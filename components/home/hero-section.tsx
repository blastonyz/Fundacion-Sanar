import Link from "next/link"

export function HeroSection() {
  return (
    <div className="@container">
      <div className="md:p-4">
        <div 
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat md:gap-8 md:rounded-xl items-center justify-around p-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCjkjuDNs-2KtVnkaqzWmIadZD7VbW3z8-teaGV4JM51KW68hg8uljZqAz78rAIatTOdld2TYn67VGJt-NBboGkPK3kwuIqr1dDMT06G9EgTVAI1MyHmJe2nWsl3VuPOp0iH0851mCxu55akvtQnLsN_tf5o8BG1hxKUyDdVzQFBa9OlMRAUg3qJqLNuKOIR0e4X_sIiCb3u6NtaXNJp8tPZDsIp1MbfS5aSn0bpalXGNZkhxGs_GBAiaptSfKdtAVwI3OppXRECxE")`
          }}
        >
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-white text-6xl font-black leading-tight tracking-tight md:text-7xl text-balance font-title">
              S.A.N.A.R.
            </h1>
            <h2 className="text-white text-sm font-normal leading-normal md:text-base">
              Sanación alternativa con métodos naturales.
            </h2>
          </div>
          <div className=" flex flex-row justify-center w-full gap-10">
            <Link 
            href="/servicios"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 md:h-12 md:px-5 bg-primary text-primary-foreground text-sm font-bold leading-normal tracking-wide md:text-base"
          >
            <span className="truncate">Hazte Miembro</span>
          </Link>

          <Link 
            href="/servicios"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 md:h-12 md:px-5 bg-primary text-primary-foreground text-sm font-bold leading-normal tracking-wide md:text-base"
          >
            <span className="truncate">Donaciones</span>
          </Link>
          </div>

          
        </div>
      </div>
    </div>
  )
}
