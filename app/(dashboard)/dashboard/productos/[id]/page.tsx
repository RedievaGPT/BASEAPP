import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/products/product-form'
import { db } from '@/lib/db'

async function getProduct(id: string) {
  const product = await db.product.findUnique({
    where: { id },
    include: { category: true }
  })
  
  return product
}

export default async function EditProductPage({
  params
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Editar Producto</h1>
      </div>
      <ProductForm product={product} />
    </div>
  )
}