"use client"

import { getAllExhibitor } from "@/app/api/exhibitors/actions"
import { FavoriteButton } from "@/components/favorite-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Exhibitor } from "@/lib/types"
import {
  ArrowLeft,
  Building2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Share2,
  Star,
  Users
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"

export default function ExpositorDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [exhibitor, setExhibitor] = useState<Exhibitor | null>(null)
  const [relatedExhibitors, setRelatedExhibitors] = useState<Exhibitor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchExhibitor() {
      try {
        // Buscar todos os expositores
        const response = await getAllExhibitor()
        if (response.success && response.data) {
          // Encontrar o expositor específico
          const currentExhibitor = response.data.find((e) => e.id === id)
          
          if (!currentExhibitor) {
            notFound()
            return
          }

          setExhibitor(currentExhibitor)

          // Buscar expositores relacionados (mesma categoria)
          const related = response.data
            .filter((e) => e.id !== id && e.category === currentExhibitor.category)
            .slice(0, 3)
          setRelatedExhibitors(related)
        } else {
          notFound()
        }
      } catch (error) {
        console.error("Erro ao buscar expositor:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    fetchExhibitor()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!exhibitor) {
    notFound()
  }

  const handleShare = async () => {
    const shareData = {
      title: `AGROPEC 2025 - ${exhibitor.name}`,
      text: `Conheça ${exhibitor.name} na Feira Agropecuária de Paragominas. Localização: ${exhibitor.location}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        alert("Link copiado para a área de transferência!")
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1" />
        <FavoriteButton id={exhibitor.id} type="exhibitor" name={exhibitor.name} />
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Compartilhar</span>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card principal do expositor */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="relative w-full sm:w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={exhibitor.logo || "/placeholder.svg"}
                    alt={exhibitor.name}
                    fill
                    className="object-contain p-2"
                    sizes="128px"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getCategoryColor(exhibitor.category)}>
                      {exhibitor.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl">{exhibitor.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações básicas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Localização</p>
                    <p className="font-medium">{exhibitor.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="font-medium">{exhibitor.category}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Descrição */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sobre o Expositor</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {exhibitor.description}
                </p>
              </div>

              {/* Contatos */}
              {(exhibitor.phone || exhibitor.email || exhibitor.website) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contatos</h3>
                  <div className="flex flex-wrap gap-3">
                    {exhibitor.phone && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`tel:${exhibitor.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {exhibitor.phone}
                        </Link>
                      </Button>
                    )}
                    {exhibitor.email && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`mailto:${exhibitor.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Link>
                      </Button>
                    )}
                    {exhibitor.website && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={exhibitor.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Website
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/mapa">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver no Mapa
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/expositores">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Expositores
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/programacao">
                  <Clock className="h-4 w-4 mr-2" />
                  Ver Programação
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Expositores relacionados */}
          {relatedExhibitors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expositores Similares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedExhibitors.map((relatedExhibitor) => (
                  <Link
                    key={relatedExhibitor.id}
                    href={`/expositores/${relatedExhibitor.id}`}
                    className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={relatedExhibitor.logo || "/placeholder.svg"}
                          alt={relatedExhibitor.name}
                          fill
                          className="object-contain p-1"
                          sizes="48px"
                        />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {relatedExhibitor.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {relatedExhibitor.location}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {relatedExhibitor.category}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Informações adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expositor participante</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">AGROPEC 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">09 a 17 de Agosto</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
