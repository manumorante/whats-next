# What's Next

Lista de tareas minimalista con Next.js + Turso (SQLite en la nube)

## Estructura del Proyecto

```
├── app/
│   ├── api/tasks/          # API Routes (endpoints REST)
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página home
│   └── globals.css         # Estilos globales
├── components/             # Componentes React
│   ├── TaskForm.tsx        # Formulario de tareas
│   ├── TaskItem.tsx        # Item individual de tarea
│   └── TaskList.tsx        # Lista de tareas
├── hooks/                  # Custom hooks
│   └── useTasks.ts         # Hook para gestión de tareas
├── lib/                    # Utilidades y lógica de negocio
│   ├── db.ts               # Configuración Turso
│   ├── tasks.ts            # Operaciones CRUD
│   └── types.ts            # Tipos TypeScript
└── .env.local              # Variables de entorno
```

## Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v4
- **Data Fetching**: SWR (de Vercel)
- **Database**: Turso (SQLite en la nube)
- **Language**: TypeScript 5

## Desarrollo Local

```bash
npm install
npm run dev
```

Abre: http://localhost:3000

## Variables de Entorno

Crea un archivo `.env.local`:

```env
TURSO_DATABASE_URL=tu-url-de-turso
TURSO_AUTH_TOKEN=tu-token-de-turso
```

## Despliegue en Vercel

```bash
vercel
```

O conecta tu repositorio de GitHub a Vercel para auto-deploy.

## Características

- ✅ CRUD completo de tareas
- ✅ Persistencia en la nube (Turso)
- ✅ UI minimalista con colores neutrales
- ✅ TypeScript estricto
- ✅ Arquitectura limpia y modular
- ✅ API Routes serverless
