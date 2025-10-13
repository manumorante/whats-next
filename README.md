# What's Next?

El README web vive en la propia aplicación. Arranca el proyecto y visita [`/readme`](http://localhost:3000/readme) para ver la guía completa con estilo Tailwind.

## Puesta en marcha rápida

```bash
npm install
npm run dev
```

Variables necesarias (`.env.local`):

```
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

Migraciones iniciales:

```bash
turso db shell <db> < migrations/001_initial_schema.sql
```

---

¿Quieres editar la documentación? Abre `app/readme/page.tsx` y modifica el contenido Tailwind directamente.
