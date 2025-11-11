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
  
  // Vérifier si on est sur une page admin
  const isAdminPage = location.startsWith('/admin');
  const isOwnerPage = location.startsWith('/owner');
  
  // Pages qui n'ont pas besoin du header/footer
  const noLayoutPages = ['/login', '/register'];
  const needsLayout = !isAdminPage && !isOwnerPage && !noLayoutPages.includes(location);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Afficher le header seulement pour les pages client */}
      {needsLayout && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {/* Afficher le footer seulement pour les pages client */}
      {needsLayout && <Footer />}
    </div>
  );
}
