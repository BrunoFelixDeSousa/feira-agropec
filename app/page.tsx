import { HomeContent } from "@/components/home-content"
import { HeroCarouselServer } from "@/features/hero-carousel-server"

export default function Home() {
  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Hero Carousel */}
      <HeroCarouselServer />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <HomeContent />
      </div>
    </div>
  )
}
