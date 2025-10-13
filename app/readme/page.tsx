export default function ReadmePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <article className="space-y-12 rounded-3xl border border-neutral-200 bg-white/95 px-8 py-12 shadow-xl shadow-black/5 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900/80 dark:shadow-black/20">
        <header className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
            Documentación · What's Next
          </span>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Qué hace este proyecto
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            What's Next es un asistente que sugiere la siguiente actividad ideal según el momento
            del día, tus contextos definidos y el estado de tus tareas. Esta guía describe cómo
            funciona el motor de sugerencias y cómo puedes alimentarlo.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            1. Datos que alimentan las sugerencias
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              title="Contextos activos"
              description="Definen qué momento del día es (laboral, fin de semana, etc.). Si un contexto coincide con la hora actual, la actividad se considera."
            />
            <InfoCard
              title="Ventanas horarias"
              description="Rangos opcionales con día y hora de inicio/fin. Pueden cruzar medianoche y marcan cuándo es ideal ejecutar la actividad."
            />
            <InfoCard
              title="Prioridad"
              description="Valores `urgent`, `important`, `someday` que ajustan la urgencia de la sugerencia."
            />
            <InfoCard
              title="Nivel de energía"
              description="Valores `high`, `medium`, `low` para alinear la actividad con tu energía actual."
            />
            <InfoCard
              title="Última ejecución"
              description="Fecha de la última vez que la completaste; evita repetir actividades muy rápido."
            />
            <InfoCard
              title="Categoría"
              description="Permite filtrar sugerencias si seleccionas una categoría concreta."
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            2. Flujo del motor de sugerencias
          </h2>
          <ol className="space-y-3 text-neutral-600 dark:text-neutral-300">
            <li>
              <strong className="text-neutral-900 dark:text-neutral-100">Carga de datos.</strong>{' '}
              Se traen las actividades incompletas y los contextos activos.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-neutral-100">Filtrado.</strong> Se
              descartan actividades sin contextos ni horarios.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-neutral-100">Coincidencia temporal.</strong>{' '}
              Se valida coincidencia con contextos o ventanas horarias (incluyendo rangos que cruzan
              medianoche).
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-neutral-100">Puntuación.</strong> Se
              suman o restan puntos según reglas de prioridad, energía y recencia.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-neutral-100">Orden final.</strong> Se
              ordenan por score y se devuelven las mejores sugerencias.
            </li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            3. Tabla de pesos
          </h2>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full table-fixed border-collapse text-sm text-neutral-700 dark:text-neutral-200">
              <thead className="bg-neutral-100 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Regla</th>
                  <th className="px-4 py-3 text-left font-semibold">Puntaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <TableRow rule="Coincide con una ventana horaria" score="+60" />
                <TableRow rule="Coincide con un contexto activo" score="+50" />
                <TableRow rule="Prioridad urgent / important / someday" score="+40 / +25 / +10" />
                <TableRow rule="Energía alineada a la franja horaria" score="+15" />
                <TableRow rule="Completada hace < 2h / < 6h" score="-30 / -15" />
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            4. Alta rápida
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            El formulario de creación rápida rellena datos según la hora y los contextos vigentes
            para acelerar la captura:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <ShortcutCard label="Fin de semana" value="Categoría ocio · Prioridad baja" />
            <ShortcutCard label="06:00 – 09:00" value="Energía alta · Prioridad importante" />
            <ShortcutCard label="09:00 – 18:00" value="Categoría productiva · Energía media" />
            <ShortcutCard label="18:00 – 22:00" value="Categoría ocio · Energía baja" />
            <ShortcutCard label="22:00 – 06:00" value="Categoría bienestar · Energía baja" />
            <ShortcutCard label="Contextos vigentes" value="Se añaden como context_ids" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            5. Ejecutar el proyecto
          </h2>
          <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
            <p>Instala y levanta la app:</p>
            <CodeBlock>npm install</CodeBlock>
            <CodeBlock>npm run dev</CodeBlock>
            <p>Crea <code>.env.local</code> con:</p>
            <CodeBlock>
              {`TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...`}
            </CodeBlock>
            <p>Aplica migraciones iniciales:</p>
            <CodeBlock>turso db shell &lt;db&gt; &lt; migrations/001_initial_schema.sql</CodeBlock>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-emerald-500/10 px-6 py-5 text-sm text-emerald-700 dark:bg-emerald-500/5 dark:text-emerald-300">
          <p className="font-medium">Quieres editar la documentación?</p>
          <p>
            Todo el contenido se escribe directamente en <code>app/readme/page.tsx</code> con
            Tailwind. Cualquier cambio aquí no afecta al README de GitHub.
          </p>
        </section>
      </article>
    </main>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 px-4 py-5 text-sm text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300">
      <h3 className="mb-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function TableRow({ rule, score }: { rule: string; score: string }) {
  return (
    <tr>
      <td className="px-4 py-3 align-top">{rule}</td>
      <td className="px-4 py-3 align-top font-medium text-neutral-900 dark:text-neutral-100">
        {score}
      </td>
    </tr>
  );
}

function ShortcutCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/90 px-4 py-4 text-sm text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300">
      <p className="text-neutral-900 dark:text-neutral-100">{label}</p>
      <p className="mt-1 text-neutral-500 dark:text-neutral-400">{value}</p>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-neutral-900/90 px-4 py-3 font-mono text-xs text-neutral-100 shadow-inner dark:bg-neutral-950">
      <code>{children}</code>
    </pre>
  );
}
