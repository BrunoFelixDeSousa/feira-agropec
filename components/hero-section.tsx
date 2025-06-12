import { Calendar, MapPin, Sparkles, Users } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative py-8 lg:py-12 overflow-hidden rounded-lg mt-2">
      {/* Background com gradiente */}
      <div className="absolute inset-0 agropec-gradient opacity-95"></div>

      {/* Padrão decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-white rounded-full"></div>
      </div>

      <div className="relative z-10 px-4 text-center text-white">
        {/* Logo da AGROPEC */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-agropec.png"
            alt="AGROPEC 2025"
            width={120}
            height={120}
            className="h-20 w-20 lg:h-28 lg:w-28 float-animation"
          />
        </div>

        {/* Título principal */}
        <div className="mb-2">
          <h1 className="text-2xl lg:text-4xl font-black mb-1">AGROPEC 2025</h1>
          <p className="text-sm lg:text-lg font-medium opacity-90">58ª Exposição Estadual dos Produtores do Campo</p>
        </div>

        {/* Slogan */}
        <div className="mb-4">
          <p className="text-base lg:text-xl font-semibold italic">"Cultivando o Futuro, Valorizando Nossas Raízes"</p>
        </div>

        {/* Informações do evento */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm lg:text-base">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">09 a 17 de Agosto</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Paragominas - PA</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <Users className="h-4 w-4" />
            <span className="font-medium">200 mil visitantes</span>
          </div>
        </div>

        {/* Destaque especial */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-2 text-yellow-100 border border-yellow-400/30">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Primeira feira carbono neutro do Norte do País</span>
          </div>
        </div>


        {/* <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Link href="/programacao" className="flex items-center justify-center">
              Ver Programação
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-white border-2 border-white hover:bg-white hover:text-primary font-semibold shadow-lg transition-all duration-300 hover:scale-105 bg-transparent"
          >
            <Link href="/mapa" className="flex items-center justify-center">
              Explorar Mapa
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-white border-2 border-white hover:bg-white hover:text-primary font-semibold shadow-lg transition-all duration-300 hover:scale-105 bg-transparent"
          >
            <Link href="/expositores" className="flex items-center justify-center">
              Expositores
            </Link>
          </Button>
        </div> */}

        {/* Informação da realização */}
        <div className="mt-8 pt-4 border-t border-white/20">
          <p className="text-xs lg:text-sm opacity-80">
            <span className="font-semibold">Realização:</span> Sindicato dos Produtores Rurais de Paragominas
          </p>
        </div>
      </div>
    </section>
  )
}
