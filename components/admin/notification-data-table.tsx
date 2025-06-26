"use client"

import { AlertCircle, Calendar, Edit, Info, MoreHorizontal, Tag, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { deleteNotificationAction } from "@/app/admin/notificacoes/actions"
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
import { Badge } from "@/components/ui/badge"
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
import { toast } from "@/hooks/use-toast"
import type { Notification } from "@/lib/types"

export function NotificationDataTable() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/notifications")
        const { success, data } = await res.json()
        if (success && Array.isArray(data)) {
          setNotifications(data)
        } else {
          setError("Erro ao buscar notificações.")
        }
      } catch (err) {
        setError("Erro ao buscar notificações.")
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications();
  }, [])

  const handleDelete = (id: string) => {
    setDeleteId(id)
    deleteNotificationAction(id)
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
      case "INFO":
        return <Info className="h-4 w-4 text-blue-500" />
      case "ALERT":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "URGENT":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "SCHEDULE_CHANGE":
        return <Calendar className="h-4 w-4 text-orange-500" />
      case "REMINDER":
        return <Tag className="h-4 w-4 text-purple-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "INFO":
        return "Informação"
      case "ALERT":
        return "Alerta"
      case "WARNING":
        return "Aviso"
      case "URGENT":
        return "Urgente"
      case "SCHEDULE_CHANGE":
        return "Alteração de Programação"
      case "REMINDER":
        return "Lembrete"
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "INFO":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "ALERT":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "WARNING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "URGENT":
        return "bg-red-200 text-red-900 hover:bg-red-300"
      case "SCHEDULE_CHANGE":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      case "REMINDER":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  if (loading) {
    return <div className="p-4">Carregando notificações...</div>
  }
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>
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
              <TableHead>Lida</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{notification.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(notification.type)}
                    <Badge className={getTypeColor(notification.type)}>{getTypeLabel(notification.type)}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {notification.timestamp ? (
                    (() => {
                      // Garantir que a data seja interpretada corretamente
                      const date = new Date(notification.timestamp)
                      // Verificar se a data é válida
                      if (isNaN(date.getTime())) {
                        return "Data inválida"
                      }
                      return date.toLocaleDateString("pt-BR", { 
                        day: "2-digit", 
                        month: "2-digit", 
                        year: "numeric",
                        timeZone: "America/Sao_Paulo"
                      })
                    })()
                  ) : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={notification.read ? "default" : "secondary"}>
                    {notification.read ? "Lida" : "Não lida"}
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
