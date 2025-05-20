"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface CountdownTimerProps {
  targetDate: string
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        clearInterval(interval)
        setIsExpired(true)
        return
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((difference % (1000 * 60)) / 1000)

      setDays(d)
      setHours(h)
      setMinutes(m)
      setSeconds(s)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 border-green-200 dark:border-green-800">
      <CardContent className="p-3 sm:p-4">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-green-800 dark:text-green-400">
            {isExpired ? "A Feira já começou!" : "Contagem Regressiva"}
          </h3>
          {!isExpired ? (
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              <CountdownItem value={days} label="Dias" />
              <CountdownItem value={hours} label="Horas" />
              <CountdownItem value={minutes} label="Min" />
              <CountdownItem value={seconds} label="Seg" />
            </div>
          ) : (
            <p className="text-green-700 dark:text-green-300 font-medium text-sm sm:text-base">
              Venha nos visitar no Parque de Exposições de Paragominas!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface CountdownItemProps {
  value: number
  label: string
}

function CountdownItem({ value, label }: CountdownItemProps) {
  const [key, setKey] = useState(0)
  const [prevValue, setPrevValue] = useState(value)

  // Detectar mudança de valor para animar
  useEffect(() => {
    if (prevValue !== value) {
      setKey((prev) => prev + 1)
      setPrevValue(value)
    }
  }, [value, prevValue])

  const flipVariants = {
    initial: { rotateX: 0 },
    flip: { rotateX: 360, transition: { duration: 0.6 } },
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={key}
        initial="initial"
        animate="flip"
        variants={flipVariants}
        className="relative bg-white dark:bg-green-950 rounded-lg shadow-sm w-full py-1 sm:py-2 px-1 text-center mb-1"
      >
        <span className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-400">
          {value.toString().padStart(2, "0")}
        </span>
      </motion.div>
      <span className="text-[10px] sm:text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
