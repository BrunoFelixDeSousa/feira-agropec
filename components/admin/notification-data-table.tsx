"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MoreHorizontal, Edit, Trash2, Send, AlertCircle, Info, Calendar, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Dados de exemplo para notificações
const mockNotifications = [
  {
    id: "1",
    title: "Bem-vindo à Feira Agropecuária",
    content: "Estamos felizes em recebê-lo na maior feira agropecuária da região!",
    date: new Date(2023, 5, 15),
    type: "info",
    status: "sent",
    scheduled: false,
    urgent: false,
  },
  {
    id: "2",
    title: "Alteração na programação",
    content: "O show de hoje foi adiado para amanhã devido às condições climáticas.",
    date: new Date(2023, 5, 16),
    type: "alert",
    status: "sent",
    scheduled: false,
    urgent: true,
  },
  {
    id: "3",
    title: "Novo expositor confirmado",
    content: "Temos o prazer de anunciar que a empresa XYZ estará presente na feira.",
    date: new Date(2023, 5, 17),
    type: "info",
    status: "draft",
    scheduled: true,
    urgent: false,
  },
  {
    id: "4",
    title: "Promoção especial",
    content: "Aproveite descontos especiais nos produtos da feira hoje!",
    date: new Date(2023, 5, 18),
    type: "promo",
    status: "draft",
    scheduled: true,
    urgent: false,
  },
  {
    id: "5",
    title: "Evento especial",
    content: "Não perca o leilão de gado que acontecerá hoje às 15h.",
    date: new Date(2023, 5, 19),
    type: "event",
    status: "draft",
    scheduled: false,
    urgent: true,
  },
]

export function NotificationDataTable() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setIsAlertOpen(true)
  }

  const confirmDelete = () => {
    if (deleteId) {
      setNotifications(notifications.filter((n) => n.id !== deleteId))
      toast({
        title: "Notificação excluída",
        description: "A notificação foi excluída com sucesso.",
      })
      setDeleteId(null)
    }
    setIsAlertOpen(false)
  }

  const handleSend = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, status: "sent" } : n)))
    toast({
      title: "Notificação enviada",
      description: "A notificação foi enviada com sucesso.",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "event":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "promo":
        return <Tag className="h-4 w-4 text-purple-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "info":
        return "Informação"
      case "alert":
        return "Alerta"
      case "event":
        return "Evento"
      case "promo":
        return "Promoção"
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "alert":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "event":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "promo":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{notification.title}</span>
                    {notification.urgent && (
                      <Badge variant="outline" className="mt-1 w-fit bg-red-100 text-red-800 hover:bg-red-200">
                        Urgente
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(notification.type)}
                    <Badge className={getTypeColor(notification.type)}>{getTypeLabel(notification.type)}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {format(notification.date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  {notification.scheduled && (
                    <Badge variant="outline" className="ml-2">
                      Agendada
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={notification.status === "sent" ? "default" : "secondary"}>
                    {notification.status === "sent" ? "Enviada" : "Rascunho"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(notification.id)}>
                        Copiar ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/notificacoes/${notification.id}`}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </Link>
                      </DropdownMenuItem>
                      {notification.status !== "sent" && (
                        <DropdownMenuItem onClick={() => handleSend(notification.id)}>
                          <Send className="mr-2 h-4 w-4" /> Enviar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDelete(notification.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a notificação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
