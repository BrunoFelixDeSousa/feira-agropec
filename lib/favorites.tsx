"use client"

import { useState, useEffect } from "react"

// Tipos de itens que podem ser favoritados
export type FavoriteType = "exhibitor" | "event"

// Interface para um item favorito
export interface FavoriteItem {
  id: string
  type: FavoriteType
  timestamp: number
}

// Hook personalizado para gerenciar favoritos
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar favoritos do localStorage ao inicializar
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem("agropec-favorites")
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites))
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadFavorites()
  }, [])

  // Salvar favoritos no localStorage quando mudam
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("agropec-favorites", JSON.stringify(favorites))
      } catch (error) {
        console.error("Erro ao salvar favoritos:", error)
      }
    }
  }, [favorites, isLoaded])

  // Verificar se um item é favorito
  const isFavorite = (id: string, type: FavoriteType) => {
    return favorites.some((fav) => fav.id === id && fav.type === type)
  }

  // Adicionar um item aos favoritos
  const addFavorite = (id: string, type: FavoriteType) => {
    if (!isFavorite(id, type)) {
      setFavorites([...favorites, { id, type, timestamp: Date.now() }])
    }
  }

  // Remover um item dos favoritos
  const removeFavorite = (id: string, type: FavoriteType) => {
    setFavorites(favorites.filter((fav) => !(fav.id === id && fav.type === type)))
  }

  // Alternar o estado de favorito de um item
  const toggleFavorite = (id: string, type: FavoriteType) => {
    if (isFavorite(id, type)) {
      removeFavorite(id, type)
    } else {
      addFavorite(id, type)
    }
  }

  // Obter todos os favoritos de um tipo específico
  const getFavoritesByType = (type: FavoriteType) => {
    return favorites.filter((fav) => fav.type === type)
  }

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    getFavoritesByType,
    isLoaded,
  }
}

// Contexto para compartilhar favoritos entre componentes
import { createContext, useContext, type ReactNode } from "react"

interface FavoritesContextType {
  favorites: FavoriteItem[]
  isFavorite: (id: string, type: FavoriteType) => boolean
  toggleFavorite: (id: string, type: FavoriteType) => void
  getFavoritesByType: (type: FavoriteType) => FavoriteItem[]
  isLoaded: boolean
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favoritesData = useFavorites()

  return <FavoritesContext.Provider value={favoritesData}>{children}</FavoritesContext.Provider>
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavoritesContext deve ser usado dentro de um FavoritesProvider")
  }
  return context
}
