"use client"

import { ExhibitorCard } from "@/components/exhibitor-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useMobile } from "@/hooks/use-mobile"
import { useFavoritesContext } from "@/lib/favorites"
import { Exhibitor } from "@/lib/types"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronUp, Grid, List, Search, SlidersHorizontal, Star, StarOff, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function ExpositoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "category">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [standSizeFilter, setStandSizeFilter] = useState([0, 100])
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const { getFavoritesByType, isFavorite } = useFavoritesContext()
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useMobile()

    // Buscar expositores do banco de dados quando o componente montar
    useEffect(() => {
      async function fetchExhibitors() {
        try {
          const res = await fetch("/api/exhibitors");
          const { success, data: exhibitors } = await res.json();
          if (exhibitors && success) {
            setExhibitors(exhibitors);
          }
        } catch (error) {
          console.error("Erro ao buscar expositores:", error);
        } finally {
          setIsLoading(false);
        }
      }

      fetchExhibitors();
    }, [])

  // Categorias únicas para o filtro
  const uniqueCategories = Array.from(new Set(exhibitors.map((exhibitor) => exhibitor.category)))

  // Filtrar e ordenar expositores
  const filteredExhibitors = exhibitors
    .filter((exhibitor) => {
      // Filtro de busca
      const searchMatch =
        (exhibitor.name?.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        (exhibitor.description?.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        (exhibitor.category?.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        (exhibitor.location?.toLowerCase()).includes(searchTerm.toLowerCase())

      // Filtro de categoria
      const categoryMatch = selectedCategory === "todos" || (exhibitor.category) === selectedCategory

      // Filtro de tamanho (corrigido para não bloquear tudo se id não for numérico)
      let standSize = (Number.parseInt(exhibitor.id) % 10) * 10
      if (Number.isNaN(standSize)) standSize = 50 // valor padrão se id não for numérico
      const sizeMatch = standSize >= standSizeFilter[0] && standSize <= standSizeFilter[1]

      // Filtro de favoritos
      const favoriteMatch = !onlyFavorites || isFavorite(exhibitor.id, "exhibitor")

      return searchMatch && categoryMatch && sizeMatch && favoriteMatch
    })
    .sort((a, b) => {
      // Ordenação
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? (a.name).localeCompare(b.name)
          : (b.name).localeCompare(a.name)
      } else {
        return sortOrder === "asc"
          ? (a.category).localeCompare(b.category)
          : (b.category).localeCompare(a.category)
      }
    })

  // Limpar filtros
  const clearFilters = () => {
    setSelectedCategory("todos")
    setStandSizeFilter([0, 100])
    setOnlyFavorites(false)
    setSortBy("name")
    setSortOrder("asc")
  }

  // Verificar se há filtros ativos
  const hasActiveFilters =
    selectedCategory !== "todos" ||
    standSizeFilter[0] > 0 ||
    standSizeFilter[1] < 100 ||
    onlyFavorites ||
    sortBy !== "name" ||
    sortOrder !== "asc"

  // Renderizar o painel de filtros para desktop
  const renderDesktopFilters = () => (
    <Card className="sticky top-20 w-full">
      <CardContent className="p-4">
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filtros e Ordenação</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                  Limpar
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Categoria</h4>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as categorias</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Tamanho do estande</h4>
                  <span className="text-xs text-muted-foreground">
                    {standSizeFilter[0]}m² - {standSizeFilter[1]}m²
                  </span>
                </div>
                <Slider
                  defaultValue={standSizeFilter}
                  min={0}
                  max={100}
                  step={10}
                  value={standSizeFilter}
                  onValueChange={setStandSizeFilter}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Ordenar por</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as "name" | "category")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nome</SelectItem>
                      <SelectItem value="category">Categoria</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ordem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Crescente (A-Z)</SelectItem>
                      <SelectItem value="desc">Decrescente (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="desktop-only-favorites" checked={onlyFavorites} onCheckedChange={setOnlyFavorites} />
                <Label htmlFor="desktop-only-favorites" className="flex items-center gap-2 text-sm">
                  Apenas favoritos
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Expositores</h1>
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className={hasActiveFilters ? "relative border-green-500" : ""}>
                  <SlidersHorizontal className="h-4 w-4" />
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[385px]">
                <SheetHeader>
                  <SheetTitle>Filtros e Ordenação</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)] mt-4">
                  <div className="space-y-6 pr-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Ordenar por</h3>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sort-by">Campo</Label>
                          <Select value={sortBy} onValueChange={(value) => setSortBy(value as "name" | "category")}>
                            <SelectTrigger id="sort-by" className="w-[180px]">
                              <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name">Nome</SelectItem>
                              <SelectItem value="category">Categoria</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sort-order">Ordem</Label>
                          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                            <SelectTrigger id="sort-order" className="w-[180px]">
                              <SelectValue placeholder="Ordem" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asc">Crescente (A-Z)</SelectItem>
                              <SelectItem value="desc">Decrescente (Z-A)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Categoria</h3>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todas as categorias</SelectItem>
                          {uniqueCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Tamanho do estande</h3>
                        <span className="text-xs text-muted-foreground">
                          {standSizeFilter[0]}m² - {standSizeFilter[1]}m²
                        </span>
                      </div>
                      <Slider
                        defaultValue={standSizeFilter}
                        min={0}
                        max={100}
                        step={10}
                        value={standSizeFilter}
                        onValueChange={setStandSizeFilter}
                        className="py-4"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="only-favorites" checked={onlyFavorites} onCheckedChange={setOnlyFavorites} />
                      <Label htmlFor="only-favorites" className="flex items-center gap-2">
                        Apenas favoritos
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </Label>
                    </div>
                  </div>
                </ScrollArea>
                <SheetFooter className="flex flex-row justify-between gap-2 pt-4 border-t mt-4">
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    Limpar filtros
                  </Button>
                  <SheetClose asChild>
                    <Button className="flex-1">Aplicar</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filtros para desktop */}
        {!isMobile && <div className="lg:w-1/4 xl:w-1/5">{renderDesktopFilters()}</div>}

        <div className="lg:w-3/4 xl:w-4/5">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, categoria ou estande..."
              className="pl-8 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedCategory !== "todos" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {selectedCategory}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSelectedCategory("todos")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {(standSizeFilter[0] > 0 || standSizeFilter[1] < 100) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {standSizeFilter[0]}-{standSizeFilter[1]}m²
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setStandSizeFilter([0, 100])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {onlyFavorites && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Favoritos
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setOnlyFavorites(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {(sortBy !== "name" || sortOrder !== "asc") && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {sortBy === "name" ? "Nome" : "Categoria"} ({sortOrder === "asc" ? "A-Z" : "Z-A"})
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => {
                      setSortBy("name")
                      setSortOrder("asc")
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}>
                Limpar todos
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">{filteredExhibitors.length} expositores encontrados</div>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-8 px-2"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-8 px-2"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              {/* <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-8 px-2"
                onClick={() => setViewMode("map")}
              >
                <MapIcon className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "grid" && (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {filteredExhibitors.length > 0 ? (
                      filteredExhibitors.map((exhibitor) => (
                        <motion.div
                          key={exhibitor.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} showFavorite />
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center p-6">
                        <Card>
                          <CardContent className="p-6 flex flex-col items-center">
                            <StarOff className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">
                              Nenhum expositor encontrado com os filtros selecionados.
                            </p>
                            <Button variant="outline" className="mt-4" onClick={clearFilters}>
                              Limpar filtros
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {viewMode === "list" && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid gap-3">
                    {filteredExhibitors.length > 0 ? (
                      filteredExhibitors.map((exhibitor, index) => (
                        <motion.div
                          key={exhibitor.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} layout="list" showFavorite />
                        </motion.div>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center">
                          <StarOff className="h-12 w-12 text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">
                            Nenhum expositor encontrado com os filtros selecionados.
                          </p>
                          <Button variant="outline" className="mt-4" onClick={clearFilters}>
                            Limpar filtros
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {/* {viewMode === "map" && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <ExhibitorsMap exhibitors={filteredExhibitors} />
                    </CardContent>
                  </Card>
                </motion.div>
              )} */}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
