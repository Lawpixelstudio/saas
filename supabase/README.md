# Supabase Schema - Goolo System ERP

## Instrucciones de Instalación

### Paso 1: Crear Proyecto en Supabase

1. Ir a https://supabase.com
2. Click "New Project"
3. Configurar:
   - **Organization**: Seleccionar o crear
   - **Project Name**: `goolo-system`
   - **Database Password**: Generar contraseña segura
   - **Region**: US East (Virginia) o la más cercana
4. Esperar a que se cree (~2 minutos)

### Paso 2: Ejecutar Schema

1. Ir a **SQL Editor** en el dashboard de Supabase
2. Click "New Query"
3. Copiar todo el contenido de `schema.sql`
4. Pegar en el editor
5. Click "Run" (▶️)
6. Verificar que aparezca el mensaje de confirmación

### Paso 3: Obtener Credenciales

Ir a **Settings > API** y copiar:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Paso 4: Configurar Variables de Entorno

Actualizar el archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### Paso 5: Habilitar Auth (Opcional)

Si deseas usar Supabase Auth en lugar del login local:

1. Ir a **Authentication > Providers**
2. Habilitar **Email** (ya viene habilitado)
3. (Opcional) Habilitar **Google** para OAuth

### Paso 6: Verificar RLS

1. Ir a **Authentication > Policies**
2. Verificar que todas las tablas tengan políticas
3. Probar con el usuario `kecho8a@gmail.com`

---

## Estructura de Tablas

```
┌─────────────────────────────────────────────────────────────┐
│                     GOOLO SYSTEM ERP                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ user_accounts │─────▶│ auth_audit_   │                   │
│  │              │      │    logs       │                    │
│  └──────────────┘      └──────────────┘                    │
│          │                                                  │
│          ▼                                                  │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   clients    │─────▶│   projects   │                    │
│  │              │      │              │                    │
│  └──────────────┘      └──────┬───────┘                    │
│          │                    │                             │
│          │         ┌──────────┼──────────┐                 │
│          │         ▼          ▼          ▼                 │
│          │   ┌──────────┐ ┌────────┐ ┌──────────────┐     │
│          │   │ finance_ │ │ review_│ │ project_     │     │
│          │   │ records  │ │ tasks  │ │ activities   │     │
│          │   └────┬─────┘ └────────┘ └──────────────┘     │
│          │        │                                        │
│          │        ▼                                        │
│          │   ┌──────────────┐                              │
│          │   │  payment_    │                              │
│          │   │ transactions │                              │
│          │   └──────────────┘                              │
│          │                                                  │
│          └──────────────┬──────────────┐                   │
│                         ▼              ▼                   │
│                  ┌────────────┐ ┌─────────────┐            │
│                  │ maintenance│ │  project_   │            │
│                  │  reviews   │ │   notes     │            │
│                  └────────────┘ └──────┬──────┘            │
│                                        │                   │
│                                        ▼                   │
│                                 ┌─────────────┐            │
│                                 │ checklist_  │            │
│                                 │   items     │            │
│                                 └─────────────┘            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   notifications                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Políticas RLS (Row Level Security)

### Roles del Sistema

| Rol | Permisos |
|-----|----------|
| **Super Admin** | Acceso total a todo |
| **Lead DevOps** | Gestión de clientes, proyectos, mantenimiento |
| **Auditor Técnico** | Lectura + actualización de tareas de revisión |
| **Director Financiero** | Acceso total a finanzas, lectura resto |

### Matriz de Permisos

| Tabla | Super Admin | Lead DevOps | Auditor Técnico | Director Financiero |
|-------|-------------|-------------|-----------------|---------------------|
| user_accounts | CRUD | R | R (propio) | R (propio) |
| auth_audit_logs | CRUD | R | - | - |
| security_settings | CRUD | - | - | - |
| clients | CRUD | CRUD | R | R |
| projects | CRUD | CRUD | R | R |
| finance_records | CRUD | R | - | CRUD |
| payment_transactions | CRUD | R | - | CRUD |
| maintenance_reviews | CRUD | CRUD | U (status) | R |
| review_tasks | CRUD | CRUD | U (status) | R |
| project_notes | CRUD | CRUD | R | R |
| checklist_items | CRUD | CRUD | U (checked) | R |
| notifications | CRUD | R | R | R |
| project_activities | CRUD | CRUD | R | R |

**Leyenda:** CRUD = Create/Read/Update/Delete, R = Read, U = Update

---

## Funciones de Base de Datos

| Función | Descripción |
|---------|-------------|
| `get_mrr_total()` | Calcula ingresos recurrentes mensuales |
| `get_accounts_receivable()` | Calcula cuentas por cobrar |
| `get_mora_stats()` | Obtiene estadísticas de clientes en mora |
| `get_pending_reviews_count()` | Cuenta revisiones pendientes |
| `get_active_projects_count()` | Cuenta proyectos activos |
| `log_auth_event()` | Registra eventos de auditoría |
| `is_user_locked()` | Verifica si usuario está bloqueado |
| `increment_failed_attempts()` | Incrementa intentos fallidos |
| `reset_failed_attempts()` | Resetea intentos en login exitoso |
| `calculate_next_review_date()` | Calcula próxima fecha de revisión |
| `get_user_role()` | Obtiene rol del usuario actual |

---

## Tablas Creadas (13)

1. **user_accounts** - Cuentas de usuario
2. **security_settings** - Configuración de seguridad
3. **auth_audit_logs** - Registro de auditoría
4. **clients** - Directorio de clientes
5. **projects** - Proyectos
6. **finance_records** - Registros financieros
7. **payment_transactions** - Transacciones de pago
8. **maintenance_reviews** - Revisiones de mantenimiento
9. **review_tasks** - Tareas de revisión
10. **project_notes** - Notas y documentación
11. **checklist_items** - Ítems de checklist
12. **notifications** - Notificaciones
13. **project_activities** - Feed de actividad

---

## Buckets de Storage

| Bucket | Público | Límite | Tipos Permitidos |
|--------|---------|--------|------------------|
| `avatars` | Sí | 5MB | jpg, png, webp, svg |
| `client-logos` | Sí | 10MB | jpg, png, webp, svg |
| `documents` | No | 50MB | pdf, txt, md |

---

## Troubleshooting

### Error: "relation already exists"
Las tablas ya fueron creadas. Ejecutar en orden:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Luego ejecutar schema.sql
```

### Error: "permission denied for table"
Verificar que RLS esté habilitado y las políticas correctas.

### Error: "new row violates row-level security"
El usuario no tiene permisos. Verificar el rol en `user_accounts`.

---

## Seguridad

- ✅ RLS habilitado en todas las tablas
- ✅ Políticas por rol (Super Admin, DevOps, Auditor, Finanzas)
- ✅ Campos sensibles en texto (encriptar en producción)
- ✅ Audit logging para eventos de auth
- ✅ Rate limiting configurable
- ✅ Bloqueo de cuentas por intentos fallidos
- ✅ Sesiones con expiración

---

*Última actualización: 2026-08-14*
