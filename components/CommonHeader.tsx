'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Contextos', href: '/contexts', icon: '⏰' },
  { name: 'Actividades', href: '/activities', icon: '📋' },
  { name: 'Admin', href: '/admin', icon: '⚙️' },
];

export function CommonHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              What's Next
            </h1>
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              Gestiona tus actividades
            </p>
          </div>
          <nav className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-base font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
