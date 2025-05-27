"use client"

import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { CarouselSlide } from "@/lib/types"; // ou ajuste o import conforme seu projeto
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface HeroCarouselProps {
  slides: CarouselSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [direction, setDirection] = useState(0)
  const isMobile = useMobile()

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }, [])

  // Autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoplay) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoplay, nextSlide])

  // Pausar autoplay quando o usuário interagir
  const pauseAutoplay = () => {
    setAutoplay(false)
    // Reiniciar autoplay após 10 segundos de inatividade
    setTimeout(() => setAutoplay(true), 10000)
  }

  // Manipuladores de gestos para swipe em dispositivos móveis
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50) {
      prevSlide()
      pauseAutoplay()
    } else if (info.offset.x < -50) {
      nextSlide()
      pauseAutoplay()
    }
  }

  // Variantes para animação
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  return (
    <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slides[current].id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <div className="relative h-full">
            <Image
              src={slides[current].image || "/placeholder.svg"}
              alt={slides[current].title}
              fill
              className="object-cover brightness-75"
              priority
            />

            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-10 lg:p-16 text-white container mx-auto">
              <div className="max-w-3xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">
                  {slides[current].title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4 md:mb-6">{slides[current].description}</p>
                <div className="flex gap-2">
                  {slides[current].link && (
                    <Button asChild size={isMobile ? "sm" : "default"} className="bg-green-600 hover:bg-green-700">
                      <Link href={slides[current].link}>Saiba mais</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles - escondidos em telas muito pequenas, já que temos swipe */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 hidden sm:block">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
          onClick={() => {
            prevSlide()
            pauseAutoplay()
          }}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 hidden sm:block">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
          onClick={() => {
            nextSlide()
            pauseAutoplay()
          }}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${index === current ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
            onClick={() => {
              setCurrent(index)
              pauseAutoplay()
            }}
          ></button>
        ))}
      </div>
    </div>
  )
}
