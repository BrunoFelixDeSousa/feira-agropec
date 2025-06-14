"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: string
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isClient, setIsClient] = useState(false)

  // Garantir que só execute no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const calculateTimeLeft = () => {
      // Converter a data do formato brasileiro DD/MM/YYYY para formato ISO
      let targetDateTime: Date;
      
      if (targetDate.includes('/')) {
        // Formato brasileiro DD/MM/YYYY
        const [day, month, year] = targetDate.split('/');
        // Manter o horário como fim do dia para mostrar até o último segundo
        targetDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 23, 59, 59);
      } else {
        // Formato ISO ou outros formatos padrão
        targetDateTime = new Date(targetDate);
      }
      
      // Data atual em tempo real
      const now = new Date();
      const difference = targetDateTime.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, isClient])

  // Mostrar loading enquanto não estiver no cliente
  if (!isClient) {
    return (
      <Card className="agropec-card border-primary/20">
        <CardContent className="p-4 lg:p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg lg:text-xl font-bold text-primary">Contagem Regressiva</h2>
            </div>
            <p className="text-sm lg:text-base text-muted-foreground mb-4">Faltam para a AGROPEC 2025</p>
            <div className="grid grid-cols-4 gap-2 lg:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="bg-primary text-white rounded-lg p-2 lg:p-4 mb-1">
                    <div className="text-xl lg:text-3xl font-bold">--</div>
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground font-medium">--</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="agropec-card border-primary/20">
      <CardContent className="p-4 lg:p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg lg:text-xl font-bold text-primary">Contagem Regressiva</h2>
          </div>

          <p className="text-sm lg:text-base text-muted-foreground mb-4">Faltam para a AGROPEC 2025</p>

          <div className="grid grid-cols-4 gap-2 lg:gap-4">
            {[
              { label: "Dias", value: timeLeft.days },
              { label: "Horas", value: timeLeft.hours },
              { label: "Min", value: timeLeft.minutes },
              { label: "Seg", value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-primary text-white rounded-lg p-2 lg:p-4 mb-1">
                  <div className="text-xl lg:text-3xl font-bold">{item.value.toString().padStart(2, "0")}</div>
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
