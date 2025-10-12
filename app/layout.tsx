import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "What's Next",
  description: 'Lista de tareas con Next.js y Turso',
  themeColor: '#0a0a0a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-neutral-950">{children}</body>
    </html>
  );
}
