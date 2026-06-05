# Diseño — Módulo de Órdenes de Trabajo

**Fecha:** 2026-06-05  
**Estado:** Aprobado  
**Fuentes:** `apps/web/task/frontend-agent-context.md`, `prd.md`

---

## Contexto

MVP para imprentas: gestión digital de órdenes de trabajo que reemplaza la "notita" manual. El módulo es el corazón del producto. Flujo completo: Lista → Detalle/Edición → PDF de taller.

---

## Decisiones de arquitectura

| Decisión | Resolución | Razón |
|---|---|---|
| Backend | Mock Zustand ahora, Supabase después | Supabase no está instalado; el swap es aislado en `entities/order/lib/` |
| PDF | `@react-pdf/renderer` client-side | Sin servidor extra, texto seleccionable, layout A5 preciso |
| Estructura | Híbrido FSD (entities + widgets) | Sigue patrón existente del proyecto (`entities/user`, `widgets/sidebar`) |
| Ruta print | Eliminada — PDF on the fly | No se necesita una página separada si el PDF se genera en el cliente |
| Modo edición | Estado local en `OrderDetail` | No es una ruta separada; `mode: 'new' | 'edit'` como prop |

---

## Estructura de archivos

```
packages/
├── ui/src/
│   ├── atoms/
│   │   ├── Button.tsx          ← existente
│   │   ├── Input.tsx           ← existente
│   │   ├── Checkbox.tsx        ← existente
│   │   ├── Select.tsx          ← mover de apps/web/src/shared/ui/
│   │   ├── DatePicker.tsx      ← mover de apps/web/src/shared/ui/
│   │   ├── Textarea.tsx        ← nuevo (baseui/textarea)
│   │   └── Badge.tsx           ← nuevo (baseui/tag)
│   ├── molecules/
│   │   ├── FormField.tsx       ← existente
│   │   └── Modal.tsx           ← nuevo (baseui/modal)
│   └── index.ts                ← agregar exports nuevos
│
└── forms/src/
    ├── mapper.tsx              ← agregar SelectAdapter, DatePickerAdapter, TextareaAdapter
    └── DeclarativeForm.tsx     ← sin cambios

apps/web/src/
├── entities/
│   └── order/
│       ├── model/
│       │   ├── types.ts
│       │   ├── store.ts
│       │   └── mockData.ts
│       └── lib/
│           ├── useOrderList.ts
│           ├── useOrder.ts
│           └── useNextOrderNumber.ts
│
└── widgets/
    └── orders/
        ├── ui/
        │   ├── OrderList/
        │   │   ├── index.tsx
        │   │   ├── OrderFilters.tsx
        │   │   ├── OrderSearchInput.tsx
        │   │   ├── OrderTable.tsx
        │   │   └── OrderRow.tsx
        │   ├── OrderDetail/
        │   │   ├── index.tsx
        │   │   ├── OrderDetailHeader.tsx
        │   │   ├── ProductionStepper.tsx
        │   │   ├── StageAdvanceButton.tsx
        │   │   ├── OrderInfoView.tsx
        │   │   ├── OrderEditForm.tsx
        │   │   ├── PaymentSummary.tsx
        │   │   └── PaymentEditForm.tsx
        │   ├── OrderForm/
        │   │   ├── index.tsx         ← schema DDF + FinishingFields
        │   │   ├── orderSchema.ts    ← schema DDF declarativo
        │   │   └── FinishingFields.tsx
        │   ├── PrintConfirmModal/
        │   │   └── index.tsx
        │   └── OrderPrintDocument/
        │       └── index.tsx         ← @react-pdf/renderer
        └── index.ts

apps/web/src/app/[locale]/(protected)/
└── orders/
    ├── page.tsx                ← <OrderList />
    ├── new/
    │   └── page.tsx            ← <OrderDetail mode="new" />
    └── [id]/
        └── page.tsx            ← <OrderDetail mode="edit" id={params.id} />
```

---

## Modelo de datos

```typescript
// entities/order/model/types.ts

export type PaymentStatus = 'paid' | 'partial' | 'pending'

export type ProductionStatus =
  | 'received'
  | 'design'
  | 'plate'
  | 'printing'
  | 'finishing'
  | 'ready'
  | 'delivered'

export interface OrderFinishing {
  numbered?: { from: number; to: number }
  copies?: number
  glued?: boolean
  perforated?: boolean
}

export interface Order {
  id: string
  order_number: number
  account_id: string
  created_at: string
  delivery_date: string
  production_status: ProductionStatus
  customer_name: string
  customer_phone?: string
  product_type?: string
  description: string
  quantity?: number
  size?: string
  material?: string
  colors?: string
  finishing: OrderFinishing
  operator_notes?: string
  internal_notes?: string
  price_total: number
  payment_status: PaymentStatus
  payment_advance?: number
}
```

---

## Capa de datos (mock → Supabase)

### `model/store.ts`
Zustand store. Interfaz:
```typescript
interface OrderStore {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'created_at'>) => Order
  updateOrder: (id: string, patch: Partial<Order>) => void
}
```
`addOrder` genera UUID y `created_at` internamente. Cuando llegue Supabase, esta función llama a `supabase.from('orders').insert()`.

### `lib/useOrderList.ts`
```typescript
type Filter = 'all' | 'today' | 'pending_payment' | 'in_production'

function useOrderList(filter: Filter, search: string): {
  orders: Order[]
  isLoading: boolean
}
```
Filtra en memoria desde el store. Con Supabase: misma firma, implementación con query + `.ilike()`.

### `lib/useOrder.ts`
```typescript
function useOrder(id: string | 'new'): {
  order: Order | null
  isLoading: boolean
  save: (data: Partial<Order>) => Promise<{ success: boolean; id: string }>
  advanceStatus: () => Promise<void>
}
```
`advanceStatus` aplica optimistic update antes de la respuesta. Si falla: revierte y lanza toast de error.

### `lib/useNextOrderNumber.ts`
```typescript
function useNextOrderNumber(): { nextNumber: number; isLoading: boolean; error: boolean }
```
Con mock: `Math.max(...orders.map(o => o.order_number)) + 1`. Con Supabase: `SELECT MAX(order_number) WHERE account_id = $1`.

---

## Componentes UI — contratos clave

### `OrderDetail` — prop interface
```typescript
interface OrderDetailProps {
  mode: 'new' | 'edit'
  id?: string  // requerido si mode === 'edit'
}
```
Maneja `isEditing: boolean` como estado local. En `mode === 'new'`, `isEditing` arranca en `true` y no se puede desactivar sin guardar.

### `ProductionStepper`
Solo lectura. Recibe `currentStatus: ProductionStatus`. Renderiza 7 pasos con estado: completado (✓), actual (resaltado), futuro (tenue). No emite eventos.

### `StageAdvanceButton`
```typescript
const STAGE_ORDER: ProductionStatus[] = [
  'received', 'design', 'plate', 'printing', 'finishing', 'ready', 'delivered'
]
```
Calcula la siguiente etapa y muestra "Avanzar a: [nombre] →". Si `currentStatus === 'delivered'`, retorna `null`. Al avanzar a `'delivered'` con `payment_status !== 'paid'`: abre diálogo de confirmación de pago.

### `OrderForm` — schema DDF
Campos gestionados por `DeclarativeForm`:
- `delivery_date` → `DATE_PICKER`
- `customer_phone` → `TEXT_FIELD`
- `description` → `TEXTAREA`
- `quantity` → `TEXT_FIELD` (type: number)
- `product_type` → `SELECT` (opciones fijas + "Otro")
- `size`, `material`, `colors` → `TEXT_FIELD`
- `operator_notes`, `internal_notes` → `TEXTAREA`

Campos fuera del schema DDF (control manual):
- `customer_name` — texto estático en edición, `TEXT_FIELD` solo en nueva orden
- `finishing` — `FinishingFields` con lógica de checkboxes condicionales
- `price_total`, `payment_status`, `payment_advance` — `PaymentEditForm`

### `OrderPrintDocument`
```typescript
interface OrderPrintDocumentProps {
  order: Order
  priceMode: 'with' | 'without'
}
```
Componente `@react-pdf/renderer`. Llamado desde `PrintConfirmModal` al confirmar. Genera Blob con `pdf(<OrderPrintDocument />).toBlob()` y abre con `URL.createObjectURL()` en nueva pestaña.

Secciones del PDF (tamaño A5):
1. Header: número de orden (≥36pt) + fechas + nombre de imprenta (con mock: constante `'Imprenta Demo'`; con Supabase: campo `account.name`)
2. Cliente: nombre + teléfono
3. Trabajo: descripción, tipo, cantidad, tamaño, material, colores, acabados
4. Instrucciones al operario (vacío = línea en blanco para escribir a mano)
5. Etapas de producción: 7 cuadros con estado (✓ si completada, vacío si pendiente)
6. Cobro (solo si `priceMode === 'with'`): total, adelanto, saldo

---

## Validaciones

| Campo | Regla |
|---|---|
| `delivery_date` | Requerido, no anterior a hoy |
| `customer_name` | Requerido, mín. 2 caracteres |
| `description` | Requerido |
| `price_total` | Requerido, > 0 |
| `payment_advance` | Requerido si `payment_status === 'partial'`, debe ser < `price_total` |

Errores inline bajo cada campo. Cero `window.alert()`.

---

## Navegación y permisos

### Nueva entrada en `NAVIGATION_CONFIG`
```typescript
{
  id: 'orders',
  path: '/orders',
  labelKey: 'orders',
  icon: ClipboardList,  // lucide-react
  requiredPermission: 'viewOrdersModule',
}
```

### Cambios en archivos de configuración
- `shared/config/permissions.ts` → agregar `VIEW_ORDERS: 'viewOrdersModule'`
- `shared/config/navigation.ts` → agregar entrada orders
- `shared/config/i18n/locales/es.json` → agregar `"orders": "Órdenes"`
- `shared/config/i18n/locales/en.json` → agregar `"orders": "Orders"`
- `entities/user/model/store.ts` → agregar `'viewOrdersModule'` a los permisos mock del usuario

### Guardia de navegación con cambios sin guardar
`OrderDetail` en modo edición registra un listener en `beforeunload` + intercepta `router.push` con un `window.confirm` propio si hay cambios sin guardar (`isDirty: boolean` del estado del formulario DDF).

---

## Badges de estado

### Producción
| Estado | Color |
|---|---|
| Recibido | Gris |
| Diseño | Azul |
| Placa | Ámbar |
| Impresión | Púrpura |
| Acabado | Ámbar |
| Listo | Verde |
| Entregado | Teal |

### Pago
| Estado | Color |
|---|---|
| Pagado | Verde |
| Adelanto | Ámbar |
| Pendiente | Rojo |

El átomo `Badge` recibe `variant: string` y `label: string`. Las variantes de color son constantes en el widget.

---

## Edge cases explícitos

- **Formulario con error en número de orden:** deshabilitar todo el formulario + mensaje "No se pudo asignar un número de orden. Intentá de nuevo."
- **Saldo negativo** (`payment_advance > price_total`): error inline en el campo, bloquea guardar.
- **"Guardar e imprimir" falla al guardar:** no abrir el modal de impresión.
- **Orden entregada:** stepper sin botón de avance; campos editables igualmente.
- **Diálogo al avanzar a "Entregado" con pago pendiente:** `<Modal>` propio (no `window.confirm`).

---

## Nuevas dependencias

| Paquete | Versión | Motivo |
|---|---|---|
| `@react-pdf/renderer` | latest | Generación de PDF client-side |

---

## Lo que NO se construye en este sprint

- Autenticación real (se asume usuario autenticado con `account_id: 'mock-account-001'`)
- Self-signup o onboarding
- Roles y permisos diferenciados
- Notificaciones WhatsApp
- Reportes / dashboard de métricas
- Historial de cambios de estado
- Duplicar orden
