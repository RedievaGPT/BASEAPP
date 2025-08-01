import { CustomerForm } from '@/components/customers/customer-form'

export default function NewCustomerPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Nuevo Cliente</h1>
      </div>
      <CustomerForm />
    </div>
  )
}