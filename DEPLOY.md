# Guía de Despliegue en Easypanel

Esta guía te ayudará a desplegar la aplicación de gestión empresarial en Easypanel.

## 📋 Pre-requisitos

1. Cuenta en Easypanel
2. Repositorio Git con el código
3. Acceso a una base de datos PostgreSQL

## 🗄️ Configurar PostgreSQL

### Opción 1: PostgreSQL en Easypanel
1. En Easypanel, crear un nuevo servicio
2. Seleccionar "PostgreSQL" del marketplace
3. Configurar:
   - **Nombre**: business-app-db
   - **Database**: business_app
   - **Username**: business_user
   - **Password**: (generar contraseña segura)
4. Deployar y anotar los datos de conexión

### Opción 2: PostgreSQL Externo
Si usas una BD externa (AWS RDS, Google Cloud SQL, etc.), anota:
- Host
- Puerto
- Database name
- Username
- Password

## 🚀 Desplegar la Aplicación

### 1. Crear Aplicación en Easypanel
1. Crear nuevo servicio de tipo "App"
2. Conectar con tu repositorio Git
3. Configurar build settings:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Port**: 3000

### 2. Variables de Entorno
Configurar las siguientes variables en Easypanel:

#### Variables Requeridas
```env
DATABASE_URL=postgresql://business_user:tu_password@business-app-db:5432/business_app
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu-clave-secreta-muy-larga-y-segura
```

#### Variables Opcionales
```env
# Google OAuth (si lo usas)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# SMTP para emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_password_de_aplicacion
SMTP_FROM=noreply@tu-dominio.com

# Configuración de empresa
COMPANY_NAME=Mi Empresa SPA
APP_URL=https://tu-dominio.com
```

### 3. Generar NEXTAUTH_SECRET
Puedes generar una clave secreta segura con:
```bash
openssl rand -base64 32
```

### 4. Configurar Dominio
1. En Easypanel, ir a la sección "Domains"
2. Agregar tu dominio personalizado
3. Configurar SSL automático

## 🛠️ Configuración Post-Despliegue

### 1. Ejecutar Migraciones
Una vez desplegada la app:

```bash
# Conectarse al contenedor (desde Easypanel terminal)
npx prisma db push

# Poblar con datos de ejemplo (opcional)
npx prisma db seed
```

### 2. Verificar Funcionamiento
1. Visitar `https://tu-dominio.com`
2. Debería redirigir a `/signin`
3. Usar credenciales de prueba:
   - Email: `admin@empresa.com`
   - Password: `admin123`

## 🔧 Configuración Avanzada

### Health Check
La aplicación incluye un endpoint de health check en `/api/health`

### Logs
Monitorear logs desde el panel de Easypanel para debugging

### Backup de Base de Datos
Configurar backups automáticos de PostgreSQL:
```bash
# Backup manual
pg_dump $DATABASE_URL > backup.sql

# Restaurar
psql $DATABASE_URL < backup.sql
```

## 🐛 Troubleshooting

### Error de Conexión a BD
```bash
# Verificar conectividad
ping business-app-db

# Verificar variables de entorno
echo $DATABASE_URL
```

### Error de Build
```bash
# Limpiar cache
npm run clean
rm -rf .next node_modules
npm install
```

### Error de Prisma
```bash
# Regenerar cliente
npx prisma generate
npx prisma db push
```

## 📊 Monitoreo

### Métricas Importantes
- Tiempo de respuesta
- Uso de memoria
- Conexiones a BD
- Errores de aplicación

### Logs de Aplicación
```bash
# Ver logs en tiempo real
docker logs -f container_name
```

## 🔒 Seguridad

### Variables de Entorno
- Nunca committear el archivo `.env`
- Usar variables seguras en producción
- Rotar secrets periódicamente

### HTTPS
- Asegurar que SSL esté habilitado
- Verificar redirección HTTP → HTTPS

### Base de Datos
- Usar contraseñas fuertes
- Limitar accesso por IP si es posible
- Configurar backups automáticos

## 📈 Escalado

### Horizontal
- Configurar múltiples instancias si es necesario
- Usar load balancer

### Vertical
- Aumentar recursos (CPU/RAM) según demanda
- Monitorear métricas de uso

## 🎯 Configuración de Producción

### Optimizaciones
```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Configuración de Next.js
El `next.config.js` ya está optimizado para producción con:
- Optimización de imágenes
- Compresión
- Bundle optimization

---

## 🆘 Soporte

Si encuentras problemas durante el despliegue:
1. Revisar logs de Easypanel
2. Verificar variables de entorno
3. Comprobar conectividad a BD
4. Consultar documentación de Easypanel

¡Tu aplicación de gestión empresarial debería estar funcionando correctamente en Easypanel! 🎉