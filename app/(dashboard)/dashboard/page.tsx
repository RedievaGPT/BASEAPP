import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { Users, Package, Receipt, TrendingUp } from 'lucide-react'

async function getDashboardData() {
  const [customers, products, invoices, quotes] = await Promise.all([
    db.customer.count(),
    db.product.count(),
    db.invoice.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    }),
    db.quote.count()
  ])

  const totalRevenue = await db.invoice.aggregate({
    _sum: { total: true },
    where: { status: 'PAID' }
  })

  const pendingInvoices = await db.invoice.aggregate({
    _sum: { total: true },
    where: { status: 'PENDING' }
  })

  return {
    customers,
    products,
    invoices,
    quotes,
    totalRevenue: totalRevenue._sum.total || 0,
    pendingInvoices: pendingInvoices._sum.total || 0
  }
}

export default async function Dashboard() {
  const data = await getDashboardData()

  const stats = [
    {
      name: 'Total Clientes',
      value: data.customers.toString(),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      name: 'Productos',
      value: data.products.toString(),
      icon: Package,
      color: 'text-green-600'
    },
    {
      name: 'Ingresos Totales',
      value: formatCurrency(Number(data.totalRevenue)),
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      name: 'Facturas Pendientes',
      value: formatCurrency(Number(data.pendingInvoices)),
      icon: Receipt,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Facturas Recientes</CardTitle>
            <CardDescription>
              Últimas facturas creadas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay facturas registradas
                </p>
              ) : (
                data.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{invoice.number}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customer.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(Number(invoice.total))}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen del Mes</CardTitle>
            <CardDescription>
              Actividad del mes actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cotizaciones</span>
                <span className="text-sm font-medium">{data.quotes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Facturas</span>
                <span className="text-sm font-medium">{data.invoices.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Clientes Activos</span>
                <span className="text-sm font-medium">{data.customers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}