"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useFavoritesContext, type FavoriteType } from "@/lib/favorites"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  id: string
  type: FavoriteType
  name?: string
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function FavoriteButton({ id, type, name, variant = "outline", size = "icon", className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext()
  const { toast } = useToast()
  const isFav = isFavorite(id, type)

  const handleToggleFavorite = () => {
    toggleFavorite(id, type)

    const itemType = type === "exhibitor" ? "expositor" : "evento"
    const itemName = name || `este ${itemType}`

    toast({
      title: isFav ? `Removido dos favoritos` : `Adicionado aos favoritos`,
      description: isFav
        ? `${itemName} foi removido dos seus favoritos`
        : `${itemName} foi adicionado aos seus favoritos`,
      duration: 2000,
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleToggleFavorite()
      }}
      className={cn(className)}
      aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart className={cn("h-[1.2rem] w-[1.2rem] transition-colors", isFav ? "fill-red-500 text-red-500" : "")} />
    </Button>
  )
}
