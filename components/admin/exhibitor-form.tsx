"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { Exhibitor } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  category: z.string().min(2, {
    message: "A categoria deve ter pelo menos 2 caracteres.",
  }),
  website: z
    .string()
    .url({
      message: "Insira uma URL válida.",
    })
    .optional()
    .or(z.literal("")),
  location_area: z.string().min(1, {
    message: "A área é obrigatória.",
  }),
  location_stand: z.string().min(1, {
    message: "O estande é obrigatório.",
  }),
  location_x: z.coerce.number().min(0, {
    message: "A coordenada X deve ser um número positivo.",
  }),
  location_y: z.coerce.number().min(0, {
    message: "A coordenada Y deve ser um número positivo.",
  }),
  contact_phone: z.string().optional().or(z.literal("")),
  contact_email: z
    .string()
    .email({
      message: "Insira um e-mail válido.",
    })
    .optional()
    .or(z.literal("")),
})

interface ExhibitorFormProps {
  defaultValues?: Exhibitor
}

export function ExhibitorForm({ defaultValues }: ExhibitorFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Transformar o objeto Exhibitor para o formato do formulário
  const formDefaultValues = defaultValues
    ? {
        name: defaultValues.name,
        description: defaultValues.description,
        category: defaultValues.category,
        website: defaultValues.website || "",
        location_area: defaultValues.location.area,
        location_stand: defaultValues.location.stand,
        location_x: defaultValues.location.x,
        location_y: defaultValues.location.y,
        contact_phone: defaultValues.contact?.phone || "",
        contact_email: defaultValues.contact?.email || "",
      }
    : {
        name: "",
        description: "",
        category: "",
        website: "",
        location_area: "",
        location_stand: "",
        location_x: 0,
        location_y: 0,
        contact_phone: "",
        contact_email: "",
      }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulação de envio para API
    setTimeout(() => {
      // Transformar os valores do formulário de volta para o formato Exhibitor
      const exhibitorData: Partial<Exhibitor> = {
        name: values.name,
        description: values.description,
        category: values.category,
        website: values.website || undefined,
        location: {
          area: values.location_area,
          stand: values.location_stand,
          x: values.location_x,
          y: values.location_y,
        },
        contact: {
          phone: values.contact_phone || undefined,
          email: values.contact_email || undefined,
        },
      }

      console.log("Dados do expositor enviados:", exhibitorData)

      toast({
        title: "Expositor salvo com sucesso!",
        description: `O expositor ${values.name} foi ${defaultValues ? "atualizado" : "criado"} com sucesso.`,
      })

      setIsSubmitting(false)
      router.push("/admin/expositores")
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do expositor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Categoria do expositor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição do expositor" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://www.exemplo.com" {...field} />
              </FormControl>
              <FormDescription>O website do expositor (opcional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área</FormLabel>
                <FormControl>
                  <Input placeholder="Área no mapa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location_stand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estande</FormLabel>
                <FormControl>
                  <Input placeholder="Número do estande" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location_x"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordenada X</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location_y"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordenada Y</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormDescription>O telefone de contato (opcional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="contato@exemplo.com" {...field} />
                </FormControl>
                <FormDescription>O e-mail de contato (opcional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/expositores")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
