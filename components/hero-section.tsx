import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative py-12 overflow-hidden rounded-lg mt-2">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Feira Agropecuária de Paragominas"
          fill
          className="object-cover brightness-50"
        />
      </div>

      <div className="relative z-10 px-4 text-center text-white">
        <h1 className="text-3xl font-bold mb-2">Feira Agropecuária</h1>
        <p className="text-lg mb-4">15 a 20 de Agosto • Paragominas</p>
        <div className="flex gap-2 justify-center">
          <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
            <Link href="/programacao">Programação</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="text-white border-white hover:bg-white/10">
            <Link href="/mapa">Mapa</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
