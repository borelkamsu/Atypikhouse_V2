'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, User, Heart, Search, Building, Shield, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const location = usePathname()
  const { toast } = useToast()

  useEffect(() => {
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

  const handleGuestFavoriteClick = () => {
    toast({
      title: 'Connexion requise',
      description: 'Vous devez être connecté pour accéder aux favoris',
      variant: 'destructive',
    })
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo - Responsive */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2" data-testid="link-home">
              <img 
                src="/images/logo.jpeg" 
                alt="AtypikHouse" 
                className="h-8 sm:h-10 lg:h-12 w-auto rounded" 
              />
              <span className="font-heading font-bold text-base sm:text-lg lg:text-xl text-primary whitespace-nowrap">
                AtypikHouse
              </span>
            </Link>
          </div>

          {/* Navigation Desktop - Cachée sur mobile et tablette */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors ${location === '/' ? "text-primary" : "text-gray-800 hover:text-primary"}`}
              data-testid="link-accueil"
            >
              Accueil
            </Link>
            <Link 
              href="/properties" 
              className={`font-medium transition-colors ${location === '/properties' ? "text-primary" : "text-gray-800 hover:text-primary"}`}
              data-testid="link-properties"
            >
              Habitations
            </Link>
            {user?.role !== 'owner' && (
              <Link 
                href="/host" 
                className={`font-medium transition-colors ${location === '/host' ? "text-primary" : "text-gray-800 hover:text-primary"}`}
                data-testid="link-host"
              >
                Devenir propriétaire
              </Link>
            )}
            <a 
              href="#about" 
              className="font-medium text-gray-800 hover:text-primary transition-colors"
            >
              À propos
            </a>
          </nav>

          {/* Actions Desktop - Visibles sur grand écran */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {user ? (
              <Link href="/favorites">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 hover:text-primary"
                  data-testid="button-favorites"
                >
                  Favoris
                </Button>
              </Link>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-700 hover:text-primary"
                onClick={handleGuestFavoriteClick}
                data-testid="button-favorites"
              >
                Favoris
              </Button>
            )}
            
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                      data-testid="button-admin"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="hidden xl:inline">Admin</span>
                    </Button>
                  </Link>
                )}
                
                {user.role === 'owner' && (
                  <Link href="/owner/dashboard">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                      data-testid="button-owner-dashboard"
                    >
                      <Building className="h-4 w-4 mr-1" />
                      <span className="hidden xl:inline">Propriétaire</span>
                    </Button>
                  </Link>
                )}
                
                <Link href="/bookings">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid="button-bookings"
                  >
                    <span className="hidden xl:inline">Mes réservations</span>
                    <span className="xl:hidden">Résa</span>
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden xl:inline">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="text-primary border-primary hover:bg-primary hover:text-white"
                    data-testid="button-login"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="bg-primary text-white hover:bg-primary/90"
                    data-testid="button-register"
                  >
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Menu burger - Visible sur mobile et tablette */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Menu mobile/tablette - Slide down */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top">
            <nav className="flex flex-col space-y-3">
              {/* Navigation links */}
              <Link 
                href="/" 
                className={`text-gray-700 hover:text-primary transition-colors py-2 ${location === '/' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMenuOpen(false)}
                data-testid="mobile-link-home"
              >
                Accueil
              </Link>
              <Link 
                href="/properties" 
                className={`text-gray-700 hover:text-primary transition-colors py-2 ${location === '/properties' ? 'text-primary font-medium' : ''}`}
                onClick={() => setIsMenuOpen(false)}
                data-testid="mobile-link-properties"
              >
                Habitations
              </Link>
              {user?.role !== 'owner' && (
                <Link 
                  href="/host" 
                  className={`text-gray-700 hover:text-primary transition-colors py-2 ${location === '/host' ? 'text-primary font-medium' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="mobile-link-host"
                >
                  Devenir propriétaire
                </Link>
              )}
              <a 
                href="#about" 
                className="text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </a>
              
              {/* Actions utilisateur mobile */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {user ? (
                  <>
                    <Link href="/favorites" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        data-testid="mobile-button-favorites"
                      >
                        Favoris
                      </Button>
                    </Link>
                    
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                          data-testid="mobile-button-admin"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Administration
                        </Button>
                      </Link>
                    )}
                    
                    {user.role === 'owner' && (
                      <Link href="/owner/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                          data-testid="mobile-button-owner"
                        >
                          <Building className="h-4 w-4 mr-2" />
                          Tableau de bord propriétaire
                        </Button>
                      </Link>
                    )}
                    
                    <Link href="/bookings" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        data-testid="mobile-button-bookings"
                      >
                        Mes réservations
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      data-testid="mobile-button-logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleGuestFavoriteClick}
                      data-testid="mobile-button-favorites"
                    >
                      Favoris
                    </Button>
                    
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-primary border-primary hover:bg-primary hover:text-white"
                        data-testid="mobile-button-login"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        className="w-full justify-start bg-primary text-white hover:bg-primary/90"
                        data-testid="mobile-button-register"
                      >
                        S'inscrire
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
