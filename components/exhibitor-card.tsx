import { FavoriteButton } from "@/components/favorite-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Exhibitor } from "@/lib/types"
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ExhibitorCardProps {
  exhibitor: Exhibitor
  layout?: "grid" | "list"
  showFavorite?: boolean
}

export function ExhibitorCard({ exhibitor, layout = "grid", showFavorite = false }: ExhibitorCardProps) {
  // Função para obter a cor da categoria
  const getCategoryColor = (category: string) => {
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
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  if (layout === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 relative rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={exhibitor.logo || "/placeholder.svg?height=200&width=200"}
                alt={exhibitor.name}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold truncate">{exhibitor.name}</h3>
                  <Badge className={`mt-1 text-[10px] sm:text-xs ${getCategoryColor(exhibitor.category)}`}>
                    {exhibitor.category}
                  </Badge>
                  <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground mt-1">
                    <MapPin className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {exhibitor.location}
                  </div>
                </div>

                {showFavorite && (
                  <FavoriteButton id={exhibitor.id} type="exhibitor" name={exhibitor.name} variant="ghost" size="sm" />
                )}
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                {exhibitor?.phone && (
                  <Button variant="outline" size="sm" className="h-6 sm:h-7 text-[10px] sm:text-xs gap-1" asChild>
                    <Link href={`tel:${exhibitor.phone}`}>
                      <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      Ligar
                    </Link>
                  </Button>
                )}

                {exhibitor?.email && (
                  <Button variant="outline" size="sm" className="h-6 sm:h-7 text-[10px] sm:text-xs gap-1" asChild>
                    <Link href={`mailto:${exhibitor.email}`}>
                      <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      Email
                    </Link>
                  </Button>
                )}

                {exhibitor.website && (
                  <Button variant="outline" size="sm" className="h-6 sm:h-7 text-[10px] sm:text-xs gap-1" asChild>
                    <Link href={exhibitor.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      Site
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-28 sm:h-32 bg-muted">
        <Image
          src={exhibitor.logo || "/placeholder.svg?height=320&width=320"}
          alt={exhibitor.name}
          fill
          className="object-contain p-2"
        />

        {showFavorite && (
          <div className="absolute top-1 right-1">
            <FavoriteButton
              id={exhibitor.id}
              type="exhibitor"
              name={exhibitor.name}
              variant="secondary"
              size="sm"
              className="h-6 w-6 sm:h-7 sm:w-7 bg-background/80 backdrop-blur-sm"
            />
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-bold text-xs sm:text-sm truncate">{exhibitor.name}</h3>
        <Badge className={`mt-1 text-[10px] sm:text-xs ${getCategoryColor(exhibitor.category)}`}>
          {exhibitor.category}
        </Badge>
        <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground mt-1">
          <MapPin className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
          {exhibitor.location}
        </div>

        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 line-clamp-2">{exhibitor.description}</p>

        <div className="flex justify-end mt-2">
          <Button variant="outline" size="sm" className="h-6 sm:h-7 text-[10px] sm:text-xs" asChild>
            <Link href={`/expositores/${exhibitor.id}`}>Ver detalhes</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
