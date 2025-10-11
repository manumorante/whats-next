import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "What's Next",
  description: 'Lista de tareas con Next.js y Turso',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
