"use client"

import { CountdownTimer } from "@/components/countdown-timer"
import { FeatureCard } from "@/components/feature-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import { useFavoritesContext } from "@/lib/favorites"
import { mockEvents, mockExhibitors } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { Bell, Calendar, CalendarDays, ChevronRight, Clock, Info, MapPin, Star, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HomeContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { isFavorite } = useFavoritesContext()
  const isMobile = useMobile()

  // Simular carregamento para animações
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filtrar eventos em destaque
  const featuredEvents = mockEvents
    .filter((event) => event.featured)
    .sort((a, b) => {
      // Ordenar por data
      const dateA = a.date.split("/").reverse().join("-")
      const dateB = b.date.split("/").reverse().join("-")
      return dateA.localeCompare(dateB)
    })
    .slice(0, isMobile ? 3 : 4)

  // Filtrar expositores em destaque (simulado usando os primeiros 4 ou 6)
  const featuredExhibitors = mockExhibitors.slice(0, isMobile ? 4 : 6)

  // Estatísticas da feira
  const stats = [
    { label: "Expositores", value: "120+" },
    { label: "Eventos", value: "50+" },
    { label: "Área", value: "30.000m²" },
    { label: "Visitantes", value: "25.000+" },
  ]

  // Obter cor com base no tipo de evento
  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      Cerimônia: "bg-purple-100 text-purple-800 border-purple-300",
      Leilão: "bg-amber-100 text-amber-800 border-amber-300",
      Palestra: "bg-blue-100 text-blue-800 border-blue-300",
      Workshop: "bg-green-100 text-green-800 border-green-300",
      Show: "bg-pink-100 text-pink-800 border-pink-300",
      Exposição: "bg-indigo-100 text-indigo-800 border-indigo-300",
      Concurso: "bg-orange-100 text-orange-800 border-orange-300",
      Rodeio: "bg-red-100 text-red-800 border-red-300",
      "Dia de Campo": "bg-cyan-100 text-cyan-800 border-cyan-300",
    }
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  // Animação para elementos que aparecem na tela
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Animação para elementos que aparecem em sequência
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Countdown Timer */}
        <motion.div initial="hidden" animate={isLoaded ? "visible" : "hidden"} variants={fadeInUp}>
          <CountdownTimer targetDate="2023-08-15T00:00:00" />
        </motion.div>

        {/* Tabs para Eventos e Expositores em Destaque */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          className="lg:pb-4"
        >
          <Tabs defaultValue="eventos" className="w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Destaques</h2>
              <TabsList>
                <TabsTrigger value="eventos" className="text-xs sm:text-sm">
                  Eventos
                </TabsTrigger>
                <TabsTrigger value="expositores" className="text-xs sm:text-sm">
                  Expositores
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="eventos" className="mt-0 space-y-3">
              <div className={isMobile ? "" : "grid grid-cols-2 gap-3"}>
                {featuredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Link href={`/programacao/${event.id}`} className="block">
                        <div className="flex items-stretch">
                          <div
                            className={`w-2 ${
                              event.type === "Show"
                                ? "bg-pink-500"
                                : event.type === "Leilão"
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                            }`}
                          ></div>
                          <div className="p-3 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-sm sm:text-base line-clamp-1">{event.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {event.date}
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {event.time}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className={`text-xs ${getEventColor(event.type)}`}>
                                {event.type}
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/programacao" className="flex items-center">
                    Ver todos os eventos
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="expositores" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                {featuredExhibitors.map((exhibitor) => (
                  <Card key={exhibitor.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <Link href={`/expositores/${exhibitor.id}`}>
                        <div className="relative h-14 sm:h-16 mb-2 bg-muted rounded-md flex items-center justify-center">
                          <Image
                            src={exhibitor.logo || "/placeholder.svg?height=100&width=200"}
                            alt={exhibitor.name}
                            width={100}
                            height={50}
                            className="object-contain max-h-12 sm:max-h-14"
                          />
                          {isFavorite(exhibitor.id, "exhibitor") && (
                            <div className="absolute top-1 right-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-xs sm:text-sm line-clamp-1">{exhibitor.name}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {exhibitor.location.stand}
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/expositores" className="flex items-center">
                    Ver todos os expositores
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Mapa Rápido */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          className="lg:hidden"
        >
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative h-36 sm:h-40">
                <Image
                  src="/placeholder.svg?height=400&width=800"
                  alt="Mapa da Feira"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-bold text-sm sm:text-base mb-1">Mapa Interativo</h3>
                  <p className="text-xs mb-2">Navegue pelo parque de exposições</p>
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/mapa">Explorar Mapa</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-6 mt-6 lg:mt-0">
        {/* Estatísticas */}
        <motion.div
          className="py-4 sm:py-6 bg-green-50 dark:bg-green-950/20 rounded-lg"
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navegação Rápida */}
        <motion.div initial="hidden" animate={isLoaded ? "visible" : "hidden"} variants={staggerContainer}>
          <h2 className="text-lg sm:text-xl font-bold mb-3">Navegação Rápida</h2>
          <div className="grid grid-cols-2 gap-3">
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={<MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />}
                title="Mapa"
                description="Localize estandes e atrações"
                link="/mapa"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={<CalendarDays className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />}
                title="Agenda"
                description="Programação completa"
                link="/programacao"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={<Users className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />}
                title="Expositores"
                description="Conheça os participantes"
                link="/expositores"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={<Bell className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />}
                title="Alertas"
                description="Receba notificações"
                link="/notificacoes"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Sobre a Feira */}
        <motion.div initial="hidden" animate={isLoaded ? "visible" : "hidden"} variants={fadeInUp}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-white dark:bg-green-950 p-2 rounded-full mt-1 hidden sm:flex">
                  <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-2">Sobre a AGROPEC</h2>
                  <p className="text-xs sm:text-sm mb-3">
                    A Feira Agropecuária de Paragominas (AGROPEC) é um dos maiores eventos do setor na região,
                    reunindo produtores rurais, empresas do agronegócio e visitantes. Com uma programação
                    diversificada, a feira oferece exposições, leilões, palestras, shows e muito mais.
                  </p>
                  <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/sobre">Saiba mais</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mapa Rápido - apenas para desktop */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          className="hidden lg:block"
        >
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=400&width=800"
                  alt="Mapa da Feira"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-bold text-base mb-1">Mapa Interativo</h3>
                  <p className="text-xs mb-2">Navegue pelo parque de exposições</p>
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/mapa">Explorar Mapa</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}