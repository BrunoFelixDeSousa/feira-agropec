"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"
import { MapPositionSelector } from "./map-position-selector"

const CATEGORIES = [
  "Agricultura",
  "Pecuária", 
  "Máquinas e Equipamentos",
  "Alimentação",
  "Tecnologia",
  "Serviços",
  "Artesanato",
  "Educação",
  "Saúde Animal",
  "Insumos Agrícolas",
  "Outros"
]

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  category: z.string().min(1, "Selecione uma categoria."),
  website: z.string().url("Insira uma URL válida.").optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email("Insira um e-mail válido.").optional().or(z.literal("")),
  logo: z.string().optional(),
  featured: z.boolean().default(false),
})

export function ExhibitorForm({ defaultValues, exhibitorId }: { defaultValues?: any, exhibitorId?: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(defaultValues?.logo || "")
  const [selectedMapPosition, setSelectedMapPosition] = useState<{
    x: number
    y: number
    label: string
    area: string
  } | null>(
    defaultValues?.mapPosition ? 
    {
      x: defaultValues.mapPosition.x,
      y: defaultValues.mapPosition.y,
      label: defaultValues.mapPosition.label,
      area: defaultValues.mapPosition.area
    } : null
  )

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "",
      website: defaultValues?.website || "",
      phone: defaultValues?.phone || "",
      email: defaultValues?.email || "",
      logo: defaultValues?.logo || "",
      featured: defaultValues?.featured || false,
    },
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null

    const formData = new FormData()
    formData.append('file', logoFile)

    try {
      const response = await fetch('/api/upload/exhibitors', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload da logo')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Erro no upload:', error)
      return null
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Upload da logo se houver um arquivo selecionado
      let logoUrl = values.logo
      if (logoFile) {
        const uploadedUrl = await uploadLogo()
        if (uploadedUrl) {
          logoUrl = uploadedUrl
        }
      }

      // Processar posição do mapa
      let mapPosition = null
      if (selectedMapPosition) {
        mapPosition = {
          id: `custom-${selectedMapPosition.x}-${selectedMapPosition.y}`,
          label: selectedMapPosition.label,
          area: selectedMapPosition.area,
          x: selectedMapPosition.x,
          y: selectedMapPosition.y
        }
      }

      const dataToSubmit = {
        name: values.name,
        description: values.description,
        category: values.category,
        location: selectedMapPosition?.area || "Não definido", // Usar área da posição do mapa
        booth: selectedMapPosition?.label || "Não definido", // Usar label da posição do mapa
        website: values.website || null,
        phone: values.phone || null,
        email: values.email || null,
        logo: logoUrl || null,
        featured: values.featured,
        mapPosition: mapPosition,
      }

      const url = exhibitorId 
        ? `/api/exhibitors/${exhibitorId}`
        : '/api/exhibitors'
      
      const method = exhibitorId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar expositor')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar expositor')
      }

      toast({
        title: exhibitorId ? "Expositor atualizado" : "Expositor criado",
        description: exhibitorId 
          ? "O expositor foi atualizado com sucesso."
          : "O expositor foi criado com sucesso.",
      })

      // Limpar formulário se for criação
      if (!exhibitorId) {
        form.reset()
        setLogoFile(null)
        setLogoPreview("")
        setSelectedMapPosition(null)
      }

      // Redirecionar para lista de expositores após 1 segundo
      setTimeout(() => {
        router.push('/admin/expositores')
      }, 1000)

    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar o expositor.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Informações do Expositor</h3>
        <p className="text-sm text-muted-foreground">
          Preencha as informações do expositor e selecione sua posição no mapa da feira.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Expositor</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do expositor" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Textarea
                    placeholder="Descreva o expositor e seus produtos/serviços"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Descreva brevemente o expositor e o que ele oferece.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campos de contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="contato@expositor.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Seleção de posição no mapa */}
          <div className="space-y-2">
            <FormLabel>Posição no Mapa</FormLabel>
            <FormDescription>
              Clique no mapa abaixo para selecionar a posição do expositor. 
              A localização e identificação do estande serão definidas automaticamente com base na posição escolhida.
            </FormDescription>
            <MapPositionSelector
              selectedPosition={selectedMapPosition}
              onPositionSelect={setSelectedMapPosition}
              onClear={() => setSelectedMapPosition(null)}
            />
            {selectedMapPosition && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                <p><strong>Posição selecionada:</strong></p>
                <p>• <strong>Área:</strong> {selectedMapPosition.area}</p>
                <p>• <strong>Identificação:</strong> {selectedMapPosition.label}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel>Logo do Expositor</FormLabel>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                  input?.click();
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Logo
              </Button>
            </div>
            {logoPreview && (
              <div className="mt-2">
                <img
                  src={logoPreview}
                  alt="Preview da logo"
                  className="h-20 w-20 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Expositor em Destaque</FormLabel>
                  <FormDescription>
                    Marque para destacar este expositor na página principal.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {exhibitorId ? "Atualizar" : "Criar"} Expositor
          </Button>
        </form>
      </Form>
    </div>
  )
}
