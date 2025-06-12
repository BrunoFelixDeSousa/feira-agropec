import { HeroSection } from "@/components/hero-section"
import { HeroCarouselServer } from "@/features/hero-carousel-server"
import { HomeContentServer } from "@/features/home-content-server"

export default function Home() {
  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Hero Carousel */}
      <HeroCarouselServer />
      <HeroSection />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <HomeContentServer />
      </div>
    </div>
  )
}
