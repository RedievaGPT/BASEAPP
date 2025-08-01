# Business Management App

Una aplicación web completa para gestión empresarial construida con Next.js 14, TypeScript, Prisma y PostgreSQL.

## 🚀 Características

- **Autenticación**: NextAuth.js con Google OAuth y credenciales
- **Dashboard**: KPIs y métricas principales 
- **Gestión de Clientes**: CRUD completo con historial
- **Catálogo de Productos**: Inventario con categorías y precios
- **Cotizaciones**: Crear y gestionar presupuestos
- **Facturación**: Generar facturas con PDF
- **Control de Gastos**: Registro y categorización
- **Reportes**: Dashboard con gráficos y estadísticas
- **Multi-usuario**: Roles y permisos (Admin, Usuario, Solo lectura)

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js
- **Iconos**: Lucide React
- **PDF**: jsPDF
- **Charts**: Chart.js

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd business-management-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
   - Crear una base de datos PostgreSQL
   - Copiar `.env.example` a `.env`
   - Configurar `DATABASE_URL` con tus credenciales

4. **Ejecutar migraciones**
```bash
npx prisma db push
```

5. **Poblar base de datos (opcional)**
```bash
npm run db:seed
```

6. **Iniciar aplicación**
```bash
npm run dev
```

## 🔐 Credenciales de Prueba

Después de ejecutar el seed:
- **Email**: admin@empresa.com
- **Contraseña**: admin123

## 📝 Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-aqui"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# SMTP para emails (opcional)
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASSWORD=""
```

## 🚢 Despliegue en Easypanel

1. **Preparar aplicación**
```bash
npm run build
```

2. **Configurar PostgreSQL en Easypanel**
   - Crear servicio PostgreSQL
   - Anotar credenciales de conexión

3. **Configurar variables de entorno**
   - `DATABASE_URL`: URL de PostgreSQL
   - `NEXTAUTH_URL`: URL de tu dominio
   - `NEXTAUTH_SECRET`: Clave secreta generada

4. **Ejecutar migraciones en producción**
```bash
npx prisma db push
npx prisma db seed
```

## 📚 Estructura del Proyecto

```
├── app/                    # App Router de Next.js 14
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Dashboard principal
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   ├── layout/           # Componentes de layout
│   └── [modules]/        # Componentes por módulo
├── lib/                   # Utilidades y configuración
├── prisma/               # Schema y migraciones
├── types/                # Definiciones de tipos
└── public/               # Archivos estáticos
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build
npm start

# Base de datos
npm run db:push      # Aplicar schema a BD
npm run db:migrate   # Crear migración
npm run db:seed      # Poblar con datos de ejemplo
npm run db:studio    # Abrir Prisma Studio

# Linting
npm run lint
```

## 🌟 Módulos Implementados

### ✅ Completados
- [x] Autenticación y usuarios
- [x] Dashboard principal
- [x] Gestión de clientes
- [x] Catálogo de productos
- [x] Layout y navegación

### 🔄 En Desarrollo
- [ ] Cotizaciones y presupuestos
- [ ] Facturación con PDF
- [ ] Control de gastos
- [ ] Reportes y analytics
- [ ] Configuración de empresa

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte y consultas, contactar a: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)

---

⭐ Si este proyecto te resulta útil, ¡dale una estrella en GitHub!