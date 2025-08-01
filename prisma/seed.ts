import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await db.invoiceItem.deleteMany()
  await db.quoteItem.deleteMany()
  await db.payment.deleteMany()
  await db.invoice.deleteMany()
  await db.quote.deleteMany()
  await db.expense.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.customer.deleteMany()
  await db.company.deleteMany()
  await db.account.deleteMany()
  await db.session.deleteMany()
  await db.user.deleteMany()

  // Create admin user
  const adminUser = await db.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@empresa.com',
      role: 'ADMIN',
    }
  })

  console.log('✅ Admin user created')

  // Create company data
  await db.company.create({
    data: {
      name: 'Mi Empresa SPA',
      taxId: '12.345.678-9',
      email: 'contacto@miempresa.com',
      phone: '+56 2 2234 5678',
      address: 'Av. Providencia 1234, Santiago, Chile',
      currency: 'CLP',
      taxRate: 19.0,
    }
  })

  console.log('✅ Company created')

  // Create categories
  const categories = await Promise.all([
    db.category.create({
      data: { name: 'Servicios' }
    }),
    db.category.create({
      data: { name: 'Productos Físicos' }
    }),
    db.category.create({
      data: { name: 'Software' }
    }),
    db.category.create({
      data: { name: 'Consultoría' }
    })
  ])

  console.log('✅ Categories created')

  // Create products
  const products = await Promise.all([
    db.product.create({
      data: {
        name: 'Consultoría en Sistemas',
        description: 'Servicios de consultoría especializada en sistemas de información',
        sku: 'CONS-001',
        price: 150000,
        cost: 100000,
        stock: 999,
        categoryId: categories[3].id,
      }
    }),
    db.product.create({
      data: {
        name: 'Desarrollo Web',
        description: 'Desarrollo de sitios web personalizados',
        sku: 'WEB-001',
        price: 500000,
        cost: 300000,
        stock: 999,
        categoryId: categories[0].id,
      }
    }),
    db.product.create({
      data: {
        name: 'Licencia Software ERP',
        description: 'Licencia anual del sistema ERP empresarial',
        sku: 'ERP-LIC-001',
        price: 1200000,
        cost: 800000,
        stock: 50,
        categoryId: categories[2].id,
      }
    }),
    db.product.create({
      data: {
        name: 'Soporte Técnico',
        description: 'Soporte técnico mensual para sistemas',
        sku: 'SUP-001',
        price: 80000,
        cost: 50000,
        stock: 999,
        categoryId: categories[0].id,
      }
    }),
    db.product.create({
      data: {
        name: 'Servidor Dell PowerEdge',
        description: 'Servidor físico Dell PowerEdge R740',
        sku: 'SERV-DELL-001',
        price: 2500000,
        cost: 2000000,
        stock: 5,
        categoryId: categories[1].id,
      }
    })
  ])

  console.log('✅ Products created')

  // Create customers
  const customers = await Promise.all([
    db.customer.create({
      data: {
        name: 'Empresa ABC Limitada',
        taxId: '76.123.456-7',
        email: 'contacto@empresaabc.cl',
        phone: '+56 2 2345 6789',
        address: 'Las Condes 2345, Santiago',
        status: 'ACTIVE',
      }
    }),
    db.customer.create({
      data: {
        name: 'Comercial XYZ S.A.',
        taxId: '98.765.432-1',
        email: 'admin@comercialxyz.cl',
        phone: '+56 9 8765 4321',
        address: 'Providencia 987, Santiago',
        status: 'ACTIVE',
      }
    }),
    db.customer.create({
      data: {
        name: 'StartUp Innovadora',
        taxId: '77.888.999-0',
        email: 'hello@startup.cl',
        phone: '+56 9 1234 5678',
        address: 'Ñuñoa 456, Santiago',
        status: 'ACTIVE',
      }
    }),
    db.customer.create({
      data: {
        name: 'Retail Plus SpA',
        taxId: '79.111.222-3',
        email: 'ventas@retailplus.cl',
        phone: '+56 2 2111 2222',
        address: 'Maipú 789, Santiago',
        status: 'ACTIVE',
      }
    })
  ])

  console.log('✅ Customers created')

  // Create quotes
  const quotes = await Promise.all([
    db.quote.create({
      data: {
        number: 'COT-2024-001',
        customerId: customers[0].id,
        userId: adminUser.id,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subtotal: 650000,
        tax: 123500,
        total: 773500,
        status: 'SENT',
        notes: 'Cotización para implementación de sistema ERP',
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 2,
              unitPrice: 150000,
              total: 300000,
            },
            {
              productId: products[1].id,
              quantity: 1,
              unitPrice: 500000,
              total: 500000,
            }
          ]
        }
      }
    }),
    db.quote.create({
      data: {
        number: 'COT-2024-002',
        customerId: customers[1].id,
        userId: adminUser.id,
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        subtotal: 1280000,
        tax: 243200,
        total: 1523200,
        status: 'ACCEPTED',
        notes: 'Cotización para licencias y soporte técnico',
        items: {
          create: [
            {
              productId: products[2].id,
              quantity: 1,
              unitPrice: 1200000,
              total: 1200000,
            },
            {
              productId: products[3].id,
              quantity: 1,
              unitPrice: 80000,
              total: 80000,
            }
          ]
        }
      }
    })
  ])

  console.log('✅ Quotes created')

  // Create invoices
  const invoices = await Promise.all([
    db.invoice.create({
      data: {
        number: 'FACT-2024-001',
        customerId: customers[1].id,
        userId: adminUser.id,
        quoteId: quotes[1].id,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subtotal: 1280000,
        tax: 243200,
        total: 1523200,
        paid: 1523200,
        status: 'PAID',
        notes: 'Factura generada desde cotización COT-2024-002',
        items: {
          create: [
            {
              productId: products[2].id,
              quantity: 1,
              unitPrice: 1200000,
              total: 1200000,
            },
            {
              productId: products[3].id,
              quantity: 1,
              unitPrice: 80000,
              total: 80000,
            }
          ]
        },
        payments: {
          create: [
            {
              amount: 1523200,
              method: 'TRANSFER',
              reference: 'TRF-2024-001',
              notes: 'Pago completo por transferencia bancaria',
            }
          ]
        }
      }
    }),
    db.invoice.create({
      data: {
        number: 'FACT-2024-002',
        customerId: customers[2].id,
        userId: adminUser.id,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subtotal: 230000,
        tax: 43700,
        total: 273700,
        paid: 0,
        status: 'PENDING',
        notes: 'Factura por servicios de consultoría',
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              unitPrice: 150000,
              total: 150000,
            },
            {
              productId: products[3].id,
              quantity: 1,
              unitPrice: 80000,
              total: 80000,
            }
          ]
        }
      }
    })
  ])

  console.log('✅ Invoices created')

  // Create expenses
  await Promise.all([
    db.expense.create({
      data: {
        userId: adminUser.id,
        description: 'Compra de licencias Microsoft Office',
        amount: 250000,
        category: 'Software',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      }
    }),
    db.expense.create({
      data: {
        userId: adminUser.id,
        description: 'Hosting y dominio anual',
        amount: 120000,
        category: 'Servicios',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      }
    }),
    db.expense.create({
      data: {
        userId: adminUser.id,
        description: 'Material de oficina',
        amount: 45000,
        category: 'Oficina',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      }
    }),
    db.expense.create({
      data: {
        userId: adminUser.id,
        description: 'Combustible vehículo empresa',
        amount: 85000,
        category: 'Transporte',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      }
    })
  ])

  console.log('✅ Expenses created')

  console.log('🎉 Database seeded successfully!')
  console.log('📧 Admin user: admin@empresa.com')
  console.log('🔑 Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })