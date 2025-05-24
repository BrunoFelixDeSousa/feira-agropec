import { HeroCarousel } from "@/components/hero-carousel"
import { getAllCarouselSlides } from "@/lib/db"

export async function HeroCarouselServer() {
  const slides = await getAllCarouselSlides()
  return <HeroCarousel slides={slides} />
}