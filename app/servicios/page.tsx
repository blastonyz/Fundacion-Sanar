import { PageHeader } from "@/components/page-header"
import { ServiceCard } from "@/components/servicios/service-card"

const services = [
  {
    title: "Terapia Floral",
    description: "Sanación a través de esencias florales para equilibrar las emociones.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArmcSaReLYSY_4z941ob0TkX7uvYea6TjmsT1dicolcesLcvM0MiWVAQfbauBvCvHV7yrtlzLdh81ZbZAc0UQ8BnkWxNlL9v-G9PnQ-VOdarTkUNh-Tkj-05JjaECULFT0srtHS1xsxPPbQdOokCw8wfxmJ3eYMMrSR4Rg0kLcecRNwmFUCf-ZasIsfibqqeGBR1rnCDgtfeBGaiXLIK5AbbBv-XAoPDJNaLwc_wBPsCHFSLoT8OHlzn1Hrku4s6TK9Cf4OzRgZSU",
    alt: "Close-up of delicate flowers used in floral therapy."
  },
  {
    title: "Reiki",
    description: "Terapia de sanación energética mediante la imposición de manos.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgMqQBJegYRInv1Yqbvb3-XntBXWVw1G_x70lQe0Lh9r7zh7u7HbG7jKbQx3sc7X9TKAMai653b23I511IcKbNGtG6JAICVbWyjvGjjj2OTcYfwpsj6l5hn-LLw2ysKF9oO0_ObT_-N2Ctc-CqSA4kn_4Ywc7Zpw1rEEE2AW0qgvcCCuo7yRPHR8HjoFNlP6X8tqPWfreLdXqROIX3ikGBovnn9ZqUjoDEd5nOaKASPUP3oHXt5lIl0VdO1FZBsvnhjEMiIg11Zhg",
    alt: "Calm image of hands held over a person in a Reiki healing session."
  },
  {
    title: "Taller de Meditación",
    description: "Aprende técnicas de meditación guiada para encontrar la paz interior.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4LNcAL3FrCIuArP4dtauL-tjCjtZBJ6FWhlHiYbva155w7iPOk3MLuCM5GysgH1o43c32CdBVGQtt_5BnOJ1Qow-O6V4p84nadhxxjPckwKZBml9yUlknJNZ7RV56wvFnqypiGcOtVS87OOpIZBxiCbOWsXVyoK1eYV1JkGKJGmalXVlQunBwUQenRp-NNW0wWE6oHEYu-Eq7OR4Pam7o4cYc52zJNbO4X8AaubOpzZRkPrfCWY05BcgeLvalrp_UTXcbqgFGJYU",
    alt: "A person meditating peacefully in a natural, serene environment."
  },
  {
    title: "Consulta Nutricional Holística",
    description: "Asesoramiento para una alimentación consciente y equilibrada.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKXH3kKCPTHb8O3FU9v--adWIU-qhfK7XD5tZc7vPszHSAbk19SC65OnCNc_gnyrNE5WVOQIaGCGfLTN-psFGHGIfGKhDuR-GlHRx22mQ1UM42NaSqkcs8hNzhpB6ryfsXz4EkYYHdEL7H8MMoZRyYBzour6WXKvbxk9d7TtWXWHUONJg5St7FSSYJp1pq74spn32Nls3uSt2dXEyr9FA4ZgE9WM_ngD9rkjywMu75RGM251zJ0t3BUrgWfxMZy2v5q4iuae_Wx_I",
    alt: "A colorful array of healthy, natural foods like fruits and vegetables."
  }
]

export default function ServiciosPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          alt="Soft, tranquil image of a misty forest with sunlight filtering through the leaves."
          className="h-full w-full object-cover opacity-15"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCukkl2C3dPY2Z_rXn5NVIYqtpaNCTcUsAvOwNpz6hV46URgQi4Te6G5gMFA8AQzhC0zh5-EM7PQ1hayXDzdB1nG8txezi26QLf65aJobq6BYBlpw7D_koj0dqgBitYl54fnHDJne1fjgW_iIV_tq3WmFKaUowvegNP8RZc7ZN-PtDns8w7RJVsud9BbsnvGr2cejceTP5IHne10r_2z9wZ3cBn4LmFX5P2X5y5RkSlJIU4coER_7QBAqh5fQlu7tdoQ8UC5Q63pck"
        />
      </div>
      
      <div className="relative z-10 flex flex-col">
        <PageHeader title="Servicios Ofrecidos" />
        
        <main className="flex flex-col gap-5 p-4">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </main>
      </div>
    </div>
  )
}
