import { mkdir, writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'Nenhum arquivo foi enviado' }, { status: 400 })
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Arquivo deve ser uma imagem' }, { status: 400 })
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Arquivo muito grande. Máximo 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Criar nome único para o arquivo
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const filename = `carousel-${timestamp}${extension}`

    // Criar diretório se não existir
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'carousel')
    await mkdir(uploadsDir, { recursive: true })

    // Salvar arquivo
    const filepath = path.join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Retornar URL pública do arquivo
    const publicUrl = `/uploads/carousel/${filename}`

    return NextResponse.json({ 
      success: true, 
      data: { 
        url: publicUrl,
        filename 
      } 
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
