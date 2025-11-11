'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, User, Heart, Search, Building, Shield, LogOut } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const location = usePathname()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      // Utilisateur non connecté
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.jpeg" alt="AtypikHouse Logo" className="h-12 mr-2 rounded" />
              <span className="font-heading font-bold text-xl text-primary">AtypikHouse</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className={`font-medium ${location.pathname === '/' ? "text-primary" : "text-gray-800 hover:text-primary"}`}>
              Accueil
            </Link>
            <Link href="/properties" className={`font-medium ${location.pathname === '/properties' ? "text-primary" : "text-gray-800 hover:text-primary"}`}>
              Habitations
            </Link>
            <Link href="/host" className={`font-medium ${location.pathname === '/host' ? "text-primary" : "text-gray-800 hover:text-primary"}`}>
              Devenir propriétaire
            </Link>
            <a href="#about" className="font-medium text-gray-800 hover:text-primary">
              À propos
            </a>
          </nav>

          {/* Actions utilisateur */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-primary">
              <Heart className="h-5 w-5" />
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Menu utilisateur connecté */}
                <div className="flex items-center space-x-2">
                  {user.role === 'admin' && (
                    <Link href="/admin/dashboard">
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                        <Shield className="h-4 w-4 mr-1" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  
                  {user.role === 'owner' && (
                    <Link href="/owner/dashboard">
                      <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white">
                        <Building className="h-4 w-4 mr-1" />
                        Propriétaire
                      </Button>
                    </Link>
                  )}
                  
                  <Link href="/bookings">
                    <Button variant="ghost" size="sm">
                      Mes réservations
                    </Button>
                  </Link>
                  
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Menu mobile ouvert */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/properties" 
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Découvrir
              </Link>
              <Link 
                href="/host" 
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Devenir hôte
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="text-gray-700">
                        <Search className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-700">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {user.role === 'admin' && (
                        <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                            <Shield className="h-4 w-4 mr-2" />
                            Administration
                          </Button>
                        </Link>
                      )}
                      
                      {user.role === 'owner' && (
                        <Link href="/owner/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full text-green-600 border-green-600 hover:bg-green-600 hover:text-white">
                            <Building className="h-4 w-4 mr-2" />
                            Tableau de bord propriétaire
                          </Button>
                        </Link>
                      )}
                      
                      <Link href="/bookings" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Mes réservations
                        </Button>
                      </Link>
                      
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-700">
                      <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-700">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 space-y-2">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-white">
                          <User className="h-4 w-4 mr-2" />
                          Connexion
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-primary text-white hover:bg-primary/90">
                          S'inscrire
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}