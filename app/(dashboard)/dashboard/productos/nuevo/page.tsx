import { ProductForm } from '@/components/products/product-form'

export default function NewProductPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Nuevo Producto</h1>
      </div>
      <ProductForm />
    </div>
  )
}