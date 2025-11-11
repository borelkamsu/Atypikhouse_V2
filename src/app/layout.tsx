import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalLayout from "@/components/layout/conditional-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AtypikHouse - Logements Atypiques",
  description: "Découvrez des logements uniques et atypiques pour vos voyages. Cabanes, yourtes, maisons flottantes et plus encore.",
  keywords: "logement atypique, cabane, yourte, maison flottante, voyage, location",
  authors: [{ name: "AtypikHouse Team" }],
  openGraph: {
    title: "AtypikHouse - Logements Atypiques",
    description: "Découvrez des logements uniques et atypiques pour vos voyages",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster />
      </body>
    </html>
  );
}
