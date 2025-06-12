"use client"

import { CalendarView } from "@/components/calendar-view";
import { EventCard } from "@/components/event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMobile } from "@/hooks/use-mobile";
import { useFavoritesContext } from "@/lib/favorites";
import { Event } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Clock, ListFilter, Search, Star, StarOff, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProgramacaoPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("todos")
  const [selectedType, setSelectedType] = useState<string>("todos")
  const [viewMode, setViewMode] = useState<"lista" | "calendario">("lista")
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false)
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<"date" | "time" | "title">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 24])
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const { isFavorite } = useFavoritesContext()
  const isMobile = useMobile()

  // Buscar eventos do banco de dados quando o componente montar
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const { success, data: events } = await res.json();
        if (events && success) {
          setEvents(events);
        }
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [])

  // Datas únicas para o filtro
  const uniqueDates = Array.from(new Set(events.map((event) => event.date)))

  // Tipos únicos para o filtro
  const uniqueTypes = Array.from(new Set(events.map((event) => event.type)))

  // Filtrar e ordenar eventos
  const filteredEvents = events
    .filter((event) => {
      // Filtro de busca
      const searchMatch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro de data
      const dateMatch = selectedDate === "todos" || event.date === selectedDate

      // Filtro de tipo
      const typeMatch = selectedType === "todos" || event.type === selectedType

      // Filtro de destaque
      const featuredMatch = !onlyFeatured || event.featured

      // Filtro de favoritos
      const favoriteMatch = !onlyFavorites || isFavorite(event.id, "event")

      // Filtro de horário
      const eventHour = Number.parseInt(event.time.split(":")[0])
      const timeMatch = eventHour >= timeRange[0] && eventHour <= timeRange[1]

      return searchMatch && dateMatch && typeMatch && featuredMatch && favoriteMatch && timeMatch
    })
    .sort((a, b) => {
      // Ordenação
      if (sortBy === "date") {
        // Converter data do formato DD/MM/YYYY para YYYY-MM-DD para comparação
        const dateA = a.date.split("/").reverse().join("-")
        const dateB = b.date.split("/").reverse().join("-")
        const dateCompare = sortOrder === "asc" ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA)

        // Se as datas forem iguais, ordenar por hora
        if (dateCompare === 0) {
          return sortOrder === "asc" ? a.time.localeCompare(b.time) : b.time.localeCompare(a.time)
        }

        return dateCompare
      } else if (sortBy === "time") {
        return sortOrder === "asc" ? a.time.localeCompare(b.time) : b.time.localeCompare(a.time)
      } else {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      }
    })

  // Agrupar eventos por data para visualização em lista
  const eventsByDate = filteredEvents.reduce(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = []
      }
      acc[event.date].push(event)
      return acc
    },
    {} as Record<string, typeof events>,
  )

  // Ordenar as datas
  const sortedDates = Object.keys(eventsByDate).sort((a, b) => {
    const dateA = a.split("/").reverse().join("-")
    const dateB = b.split("/").reverse().join("-")
    return dateA.localeCompare(dateB)
  })

  // Limpar filtros
  const clearFilters = () => {
    setSelectedDate("todos")
    setSelectedType("todos")
    setOnlyFeatured(false)
    setOnlyFavorites(false)
    setSortBy("date")
    setSortOrder("asc")
    setTimeRange([0, 24])
  }

  // Verificar se há filtros ativos
  const hasActiveFilters =
    selectedDate !== "todos" ||
    selectedType !== "todos" ||
    onlyFeatured ||
    onlyFavorites ||
    timeRange[0] > 0 ||
    timeRange[1] < 24 ||
    sortBy !== "date" ||
    sortOrder !== "asc"

  // Formatar hora para exibição
  const formatTimeRange = (range: [number, number]) => {
    return `${range[0]}:00 - ${range[1]}:00`
  }

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
                <h4 className="text-sm font-medium">Data</h4>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as datas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as datas</SelectItem>
                    {uniqueDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tipo de evento</h4>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Horário</h4>
                  <span className="text-xs text-muted-foreground">{formatTimeRange(timeRange)}</span>
                </div>
                <div className="px-2">
                  <div className="grid grid-cols-12 text-xs text-muted-foreground mb-2">
                    {[0, 6, 12, 18, 24].map((hour) => (
                      <div
                        key={hour}
                        className={`${
                          hour === 0
                            ? "col-span-1 text-left"
                            : hour === 24
                              ? "col-span-1 text-right"
                              : "col-span-2 text-center"
                        }`}
                      >
                        {hour}h
                      </div>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={timeRange[0]}
                    onChange={(e) => setTimeRange([Number.parseInt(e.target.value), timeRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={timeRange[1]}
                    onChange={(e) => setTimeRange([timeRange[0], Number.parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Ordenar por</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "time" | "title")}>
                    <SelectTrigger id="desktop-sort-by">
                      <SelectValue placeholder="Campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Data</SelectItem>
                      <SelectItem value="time">Horário</SelectItem>
                      <SelectItem value="title">Título</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                    <SelectTrigger id="desktop-sort-order">
                      <SelectValue placeholder="Ordem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Crescente</SelectItem>
                      <SelectItem value="desc">Decrescente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium">Opções</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="desktop-only-featured" checked={onlyFeatured} onCheckedChange={setOnlyFeatured} />
                    <Label htmlFor="desktop-only-featured" className="text-sm">
                      Apenas eventos em destaque
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="desktop-only-favorites" checked={onlyFavorites} onCheckedChange={setOnlyFavorites} />
                    <Label htmlFor="desktop-only-favorites" className="flex items-center gap-2 text-sm">
                      Apenas favoritos
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )

  // Mostrar indicador de carregamento enquanto os dados estão sendo buscados
  if (isLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Programação</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Programação</h1>
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className={hasActiveFilters ? "relative border-green-500" : ""}>
                  <ListFilter className="h-4 w-4" />
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
                          <Select
                            value={sortBy}
                            onValueChange={(value) => setSortBy(value as "date" | "time" | "title")}
                          >
                            <SelectTrigger id="sort-by" className="w-[180px]">
                              <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="date">Data</SelectItem>
                              <SelectItem value="time">Horário</SelectItem>
                              <SelectItem value="title">Título</SelectItem>
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
                              <SelectItem value="asc">Crescente</SelectItem>
                              <SelectItem value="desc">Decrescente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Data</h3>
                      <Select value={selectedDate} onValueChange={setSelectedDate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as datas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todas as datas</SelectItem>
                          {uniqueDates.map((date) => (
                            <SelectItem key={date} value={date}>
                              {date}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Tipo de evento</h3>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os tipos</SelectItem>
                          {uniqueTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Horário</h3>
                        <span className="text-xs text-muted-foreground">{formatTimeRange(timeRange)}</span>
                      </div>
                      <div className="px-2">
                        <div className="grid grid-cols-12 text-xs text-muted-foreground mb-2">
                          {[0, 6, 12, 18, 24].map((hour) => (
                            <div
                              key={hour}
                              className={`${
                                hour === 0
                                  ? "col-span-1 text-left"
                                  : hour === 24
                                    ? "col-span-1 text-right"
                                    : "col-span-2 text-center"
                              }`}
                            >
                              {hour}h
                            </div>
                          ))}
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="24"
                          value={timeRange[0]}
                          onChange={(e) => setTimeRange([Number.parseInt(e.target.value), timeRange[1]])}
                          className="w-full"
                        />
                        <input
                          type="range"
                          min="0"
                          max="24"
                          value={timeRange[1]}
                          onChange={(e) => setTimeRange([timeRange[0], Number.parseInt(e.target.value)])}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch id="only-featured" checked={onlyFeatured} onCheckedChange={setOnlyFeatured} />
                        <Label htmlFor="only-featured" className="flex items-center gap-2">
                          Apenas eventos em destaque
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="only-favorites" checked={onlyFavorites} onCheckedChange={setOnlyFavorites} />
                        <Label htmlFor="only-favorites" className="flex items-center gap-2">
                          Apenas favoritos
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </Label>
                      </div>
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
              placeholder="Buscar eventos, locais ou palestrantes..."
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

          {/* Filtros ativos - mostrar em desktop e mobile */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedDate !== "todos" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {selectedDate}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSelectedDate("todos")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {selectedType !== "todos" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {selectedType}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setSelectedType("todos")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {(timeRange[0] > 0 || timeRange[1] < 24) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTimeRange(timeRange)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setTimeRange([0, 24])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {onlyFeatured && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Destaques
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setOnlyFeatured(false)}
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

              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}>
                Limpar todos
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">{filteredEvents.length} eventos encontrados</div>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "lista" | "calendario")}>
              <TabsList>
                <TabsTrigger value="lista" className="flex items-center gap-1">
                  <ListFilter className="h-4 w-4" />
                  <span className="hidden sm:inline">Lista</span>
                </TabsTrigger>
                <TabsTrigger value="calendario" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendário</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === "lista" && (
              <motion.div
                key="lista"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ScrollArea className="h-[calc(100vh-13rem)] lg:h-[calc(100vh-16rem)]">
                  {filteredEvents.length > 0 ? (
                    <div className="space-y-6">
                      {sortedDates.map((date) => (
                        <div key={date}>
                          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 mb-3 border-b">
                            <h2 className="text-lg font-bold">{date}</h2>
                          </div>
                          <div className={isMobile ? "grid gap-3" : "grid grid-cols-2 gap-3"}>
                            {eventsByDate[date].map((event: Event, index: number) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                              >
                                <EventCard event={event} showFavorite />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 flex flex-col items-center">
                        <StarOff className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">Nenhum evento encontrado com os filtros selecionados.</p>
                        <Button variant="outline" className="mt-4" onClick={clearFilters}>
                          Limpar filtros
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </ScrollArea>
              </motion.div>
            )}

            {viewMode === "calendario" && (
              <motion.div
                key="calendario"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarView events={filteredEvents} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
