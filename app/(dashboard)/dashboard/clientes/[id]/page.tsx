import { notFound } from 'next/navigation'
import { CustomerForm } from '@/components/customers/customer-form'
import { db } from '@/lib/db'

async function getCustomer(id: string) {
  const customer = await db.customer.findUnique({
    where: { id }
  })
  
  return customer
}

export default async function EditCustomerPage({
  params
}: {
  params: { id: string }
}) {
  const customer = await getCustomer(params.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Editar Cliente</h1>
      </div>
      <CustomerForm customer={customer} />
    </div>
  )
}