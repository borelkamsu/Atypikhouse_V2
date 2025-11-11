'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './header';
import Footer from './footer';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const location = usePathname();
  
  // Vérifier si on est sur une page admin (seulement admin n'a pas de header/footer)
  const isAdminPage = location.startsWith('/admin');
  
  // Pages qui n'ont pas besoin du header/footer
  const noLayoutPages = ['/login', '/register'];
  const needsLayout = !isAdminPage && !noLayoutPages.includes(location);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Afficher le header pour toutes les pages sauf admin et login/register */}
      {needsLayout && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {/* Afficher le footer pour toutes les pages sauf admin et login/register */}
      {needsLayout && <Footer />}
    </div>
  );
}
