import { CarouselManager } from "@/components/admin/carousel-manager"

export default function CarouselPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento do Carousel</h2>
      </div>

      <CarouselManager />
    </div>
  )
}
