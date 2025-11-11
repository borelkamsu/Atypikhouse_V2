import Link from 'next/link';
import { Facebook, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">AtypikHouse</h3>
            <p className="text-gray-300 mb-4">
              Découvrez des habitations insolites pour des séjours inoubliables en harmonie avec la nature.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61565488786658" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/atypikhousegrp4/?igsh=Znlzemc1amJ0bnhi#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li><Link href="/cgv-cgu" className="text-gray-300 hover:text-white transition duration-300">CGV/CGU</Link></li>
              <li><Link href="/mentions-legales" className="text-gray-300 hover:text-white transition duration-300">Mentions légales</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">contact@atypikhouse.com</li>
              <li className="text-gray-300">+33 1 23 45 67 89</li>
              <li className="text-gray-300">Paris, France</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Recevez nos dernières offres et nouveautés
            </p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Votre email" 
                className="rounded-r-none bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
              <Button 
                className="rounded-l-none bg-primary hover:bg-primary-dark border-primary"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AtypikHouse. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition duration-300">
                Politique de confidentialité
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition duration-300">
                Cookies
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition duration-300">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}