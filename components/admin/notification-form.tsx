"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { paths } from "@/lib/paths"
import type { Notification } from "@/lib/types"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres",
  }),
  message: z.string().min(10, {
    message: "O conteúdo deve ter pelo menos 10 caracteres",
  }),
  timestamp: z.date({
    required_error: "Selecione uma data para a notificação",
  }),
  type: z.enum(["URGENT", "SCHEDULE_CHANGE", "REMINDER", "INFO", "WARNING", "ALERT"]),
})

type FormValues = z.infer<typeof formSchema>

interface NotificationFormProps {
  defaultValues?: Partial<Notification>
}

export function NotificationForm({ defaultValues }: NotificationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      message: defaultValues?.message || "",
      timestamp: defaultValues?.timestamp ? new Date(defaultValues.timestamp) : new Date(),
      type: (defaultValues?.type as any) || "INFO",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      const isEditing = !!defaultValues?.id
      const url = isEditing ? `/api/notifications/${defaultValues.id}` : "/api/notifications"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          message: values.message,
          type: values.type,
          timestamp: values.timestamp.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar notificação")
      }

      const result = await response.json()

      toast({
        title: isEditing ? "Notificação atualizada!" : "Notificação criada!",
        description: `A notificação "${values.title}" foi ${isEditing ? 'atualizada' : 'criada'} com sucesso.`,
      })

      router.push(paths.admin.notificacoes)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao salvar notificação",
        description: "Ocorreu um erro ao salvar a notificação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título da notificação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INFO">Informação</SelectItem>
                    <SelectItem value="ALERT">Alerta</SelectItem>
                    <SelectItem value="WARNING">Aviso</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                    <SelectItem value="SCHEDULE_CHANGE">Alteração de Programação</SelectItem>
                    <SelectItem value="REMINDER">Lembrete</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea placeholder="Conteúdo da notificação" className="min-h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timestamp"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                </PopoverContent>
              </Popover>
              <FormDescription>Data em que a notificação será enviada (se agendada) ou foi criada</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(paths.admin.notificacoes)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Notificação"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
