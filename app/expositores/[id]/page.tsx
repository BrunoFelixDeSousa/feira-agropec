"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Exhibitor } from "@/lib/types"
import { ArrowLeft, ExternalLink, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"

export default function ExpositorDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [exhibitor, setExhibitor] = useState<Exhibitor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchExhibitor() {
      try {
        const res = await fetch(`/api/exhibitors/${id}`)
        const { success, data } = await res.json()
        if (success && data) {
          setExhibitor(data)
        } else {
          setExhibitor(null)
        }
      } catch (error) {
        setExhibitor(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExhibitor()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!exhibitor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 flex flex-col items-center">
            <p className="text-muted-foreground mb-4">Expositor não encontrado.</p>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
      <Card className="overflow-hidden">
        <div className="relative h-40 sm:h-56 bg-muted flex items-center justify-center">
          <Image
            src={exhibitor.logo || "/placeholder.svg"}
            alt={exhibitor.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        <CardContent className="p-6">
          <h1 className="font-bold text-xl sm:text-2xl mb-2">{exhibitor.name}</h1>
          <Badge className={`mb-2 text-xs ${getCategoryColor(exhibitor.category)}`}>{exhibitor.category}</Badge>
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <MapPin className="mr-1 h-4 w-4" />
            {exhibitor.location}
          </div>
          <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{exhibitor.description}</p>

          <div className="flex flex-wrap justify-around gap-2 mb-2">
            {exhibitor.phone && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`tel:${exhibitor.phone}`}>
                  <Phone className="h-4 w-4 mr-1" /> Ligar
                </Link>
              </Button>
            )}
            {exhibitor.email && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`mailto:${exhibitor.email}`}>
                  <Mail className="h-4 w-4 mr-1" /> Email
                </Link>
              </Button>
            )}
            {exhibitor.website && (
              <Button variant="outline" size="sm" asChild>
                <Link href={exhibitor.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" /> Site
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getCategoryColor(category?: string) {
  const colors: Record<string, string> = {
    "Máquinas Agrícolas": "bg-blue-100 text-blue-800 border-blue-300",
    Insumos: "bg-green-100 text-green-800 border-green-300",
    "Nutrição Animal": "bg-amber-100 text-amber-800 border-amber-300",
    "Serviços Financeiros": "bg-purple-100 text-purple-800 border-purple-300",
    "Genética Animal": "bg-pink-100 text-pink-800 border-pink-300",
    Irrigação: "bg-cyan-100 text-cyan-800 border-cyan-300",
    Serviços: "bg-indigo-100 text-indigo-800 border-indigo-300",
    Energia: "bg-orange-100 text-orange-800 border-orange-300",
  }
  return colors[category ?? ""] || "bg-gray-100 text-gray-800 border-gray-300"
}
