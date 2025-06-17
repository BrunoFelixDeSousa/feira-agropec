"use client"

import { deleteEventAction } from "@/app/admin/programacao/actions"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Calendar, MapPin, Pencil, Star, Tag, Trash } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import type { Event } from "@/lib/types"

interface EventDataTableProps {
  filterType?: "upcoming" | "past" | "featured" | "all"
}

export function EventDataTable({ filterType = "all" }: EventDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [data, setData] = useState<Event[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Buscar eventos do banco de dados quando o componente montar
  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/events");
        const result = await res.json();
        
        if (result.success && result.data) {
          setEvents(result.data);
        } else {
        }
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents();
  }, [])
  
  // Filtrar os eventos com base no tipo de filtro
  useEffect(() => {
    if (events.length === 0) {
      return;
    }
    
    const now = new Date()
    let filteredEvents = [...events]

    if (filterType === "upcoming") {
      filteredEvents = filteredEvents.filter((event) => new Date(event.date) >= now)
    } else if (filterType === "past") {
      filteredEvents = filteredEvents.filter((event) => new Date(event.date) < now)
    } else if (filterType === "featured") {
      filteredEvents = filteredEvents.filter((event) => event.featured)
    }

    // Aplicar filtro de categoria se não for "all"
    if (categoryFilter !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.type === categoryFilter)
    }

    setData(filteredEvents)
  }, [events, filterType, categoryFilter]) // Adicionar 'events' como dependência

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventAction(eventId)
      // Atualizar a lista removendo o evento deletado
      setEvents((prev) => prev.filter((event) => event.id !== eventId))
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir evento:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o evento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Título
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("title")}
          {row.original.featured && (
            <Badge variant="secondary" className="ml-2">
              <Star className="h-3 w-3 mr-1" /> Destaque
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <Calendar className="mr-2 h-4 w-4" />
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        const formattedDate = date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        return <div className="flex items-center">{formattedDate}</div>
      },
    },
    {
      accessorKey: "time",
      header: "Horário",
      cell: ({ row }) => <div>{row.getValue("time")}</div>,
    },
    {
      accessorKey: "location",
      header: "Local",
      cell: ({ row }) => (
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Categoria",
      cell: ({ row }) => {
        const category = row.getValue("type") as string | undefined
        return (
          <div className="flex items-center">
            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">
              {category ? category.charAt(0).toUpperCase() + category.slice(1) : "Não categorizado"}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original

        return (
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/programacao/${event.id}`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o evento "{event.title}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          <Input
            placeholder="Filtrar eventos..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="palestra">Palestras</SelectItem>
              <SelectItem value="show">Shows</SelectItem>
              <SelectItem value="competicao">Competições</SelectItem>
              <SelectItem value="exposicao">Exposições</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="outro">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="border-t">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Carregando eventos...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {events.length === 0 ? "Nenhum evento cadastrado." : "Nenhum evento encontrado com os filtros aplicados."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {table.getRowModel().rows.length} de {data.length} eventos
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Próximo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
