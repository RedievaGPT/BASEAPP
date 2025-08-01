import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  sku: z.string().min(1, 'El SKU es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  cost: z.number().min(0, 'El costo debe ser mayor o igual a 0').default(0),
  stock: z.number().min(0, 'El stock debe ser mayor o igual a 0').default(0),
  categoryId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE')
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === 'READONLY') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = productSchema.parse({
      ...body,
      price: parseFloat(body.price),
      cost: parseFloat(body.cost || 0),
      stock: parseInt(body.stock || 0)
    })

    // Check if SKU is unique (excluding current product)
    const existingSku = await db.product.findFirst({
      where: { 
        sku: validatedData.sku,
        id: { not: params.id }
      }
    })

    if (existingSku) {
      return NextResponse.json(
        { error: 'El SKU ya existe' },
        { status: 400 }
      )
    }

    const product = await db.product.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        categoryId: validatedData.categoryId || null
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if product is used in quotes or invoices
    const [quoteItems, invoiceItems] = await Promise.all([
      db.quoteItem.findFirst({ where: { productId: params.id } }),
      db.invoiceItem.findFirst({ where: { productId: params.id } })
    ])

    if (quoteItems || invoiceItems) {
      return NextResponse.json(
        { error: 'No se puede eliminar el producto porque está siendo usado en cotizaciones o facturas' },
        { status: 400 }
      )
    }

    await db.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}