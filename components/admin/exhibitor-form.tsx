"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { paths } from "@/lib/paths"
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
  location: z.string().min(1, {
    message: "A localização é obrigatória.",
  }),
  booth: z.string().min(1, {
    message: "O estande é obrigatório.",
  }),
  website: z.string().url({ message: "Insira uma URL válida." }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email({ message: "Insira um e-mail válido." }).optional().or(z.literal("")),
  logo: z.string().optional().or(z.literal("")),
})

interface ExhibitorFormProps {
  defaultValues?: Partial<Exhibitor>
}

export function ExhibitorForm({ defaultValues }: ExhibitorFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "",
      location: defaultValues?.location || "",
      booth: defaultValues?.booth || "",
      website: defaultValues?.website || "",
      phone: defaultValues?.phone || "",
      email: defaultValues?.email || "",
      logo: defaultValues?.logo || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setTimeout(() => {
      toast({
        title: `Expositor ${defaultValues ? "atualizado" : "criado"} com sucesso!`,
        description: `O expositor ${values.name} foi ${defaultValues ? "atualizado" : "criado"} com sucesso.`,
      })
      setIsSubmitting(false)
      router.push(paths.admin.expositores)
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input placeholder="Localização do expositor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="booth"
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
            name="phone"
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
            name="email"
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
          <Button type="button" variant="outline" onClick={() => router.push(paths.admin.expositores)}>
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
