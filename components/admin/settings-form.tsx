"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDays, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

const generalFormSchema = z.object({
  siteName: z.string().min(2, {
    message: "O nome do site deve ter pelo menos 2 caracteres.",
  }),
  eventStartDate: z.string(),
  eventEndDate: z.string(),
  contactEmail: z.string().email({
    message: "Insira um e-mail válido.",
  }).optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialTwitter: z.string().optional(),
})

const notificationsFormSchema = z.object({
  enablePushNotifications: z.boolean(),
  notifyEventChanges: z.boolean(),
  notifyNewExhibitors: z.boolean(),
  notifyEmergency: z.boolean(),
  defaultNotificationType: z.string(),
})

export function SettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      siteName: "",
      eventStartDate: "",
      eventEndDate: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      socialFacebook: "",
      socialInstagram: "",
      socialTwitter: "",
    },
  })

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      enablePushNotifications: true,
      notifyEventChanges: true,
      notifyNewExhibitors: false,
      notifyEmergency: true,
      defaultNotificationType: "reminder",
    },
  })

  // Carregar configurações do banco de dados
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/settings')
        const result = await response.json()
        
        if (result.success && result.data) {
          const settings = result.data
          generalForm.reset({
            siteName: settings.siteName || "Feira Agropecuária",
            eventStartDate: settings.eventStartDate || "",
            eventEndDate: settings.eventEndDate || "",
            contactEmail: settings.contactEmail || "",
            contactPhone: settings.contactPhone || "",
            address: settings.address || "",
            socialFacebook: settings.socialFacebook || "",
            socialInstagram: settings.socialInstagram || "",
            socialTwitter: settings.socialTwitter || "",
          })
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
        toast({
          title: "Erro",
          description: "Erro ao carregar configurações. Usando valores padrão.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [generalForm])

  async function onSubmitGeneral(values: z.infer<typeof generalFormSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Configurações salvas",
          description: "As configurações gerais foram salvas com sucesso.",
        })
      } else {
        throw new Error(result.error || 'Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function onSubmitNotifications(values: z.infer<typeof notificationsFormSchema>) {
    setIsSubmitting(true)

    // TODO: Implementar API para configurações de notificações
    setTimeout(() => {
      console.log("Configurações de notificações:", values)

      toast({
        title: "Configurações salvas",
        description: "As configurações de notificações foram salvas com sucesso.",
      })

      setIsSubmitting(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">Geral</TabsTrigger>
        {/* <TabsTrigger value="notifications">Notificações</TabsTrigger> */}
        {/* <TabsTrigger value="appearance">Aparência</TabsTrigger> */}
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>Configure as informações básicas do site e do evento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações do Site</h3>

                  <FormField
                    control={generalForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Site</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Datas do Evento</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={generalForm.control}
                      name="eventStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="eventEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Término</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Informações de Contato</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={generalForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail de Contato</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone de Contato</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Redes Sociais</h3>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={generalForm.control}
                      name="socialFacebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input placeholder="https://facebook.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="socialInstagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="https://instagram.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="socialTwitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter</FormLabel>
                          <FormControl>
                            <Input placeholder="https://twitter.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Notificações</CardTitle>
            <CardDescription>Configure como as notificações são enviadas e exibidas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onSubmitNotifications)} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Preferências de Notificações</h3>
                  </div>

                  <FormField
                    control={notificationsForm.control}
                    name="enablePushNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notificações Push</FormLabel>
                          <FormDescription>Habilitar notificações push para os usuários</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationsForm.control}
                    name="notifyEventChanges"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Alterações de Eventos</FormLabel>
                          <FormDescription>Notificar sobre alterações em eventos</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationsForm.control}
                    name="notifyNewExhibitors"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Novos Expositores</FormLabel>
                          <FormDescription>Notificar sobre novos expositores</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationsForm.control}
                    name="notifyEmergency"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notificações de Emergência</FormLabel>
                          <FormDescription>Notificar sobre situações de emergência</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent> */}

      {/* <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência do site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input id="logo" type="file" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <Input id="favicon" type="file" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cores do Tema</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="text-xs">
                      Cor Primária
                    </Label>
                    <Input id="primary-color" type="color" value="#0f766e" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary-color" className="text-xs">
                      Cor Secundária
                    </Label>
                    <Input id="secondary-color" type="color" value="#2563eb" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent-color" className="text-xs">
                      Cor de Destaque
                    </Label>
                    <Input id="accent-color" type="color" value="#f59e0b" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Salvar Aparência</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent> */}
    </Tabs>
  )
}
