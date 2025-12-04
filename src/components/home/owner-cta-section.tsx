'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Home as HomeIcon, DollarSign, Shield } from 'lucide-react'

export function OwnerCTASection() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  // Ne rien afficher pendant le chargement
  if (loading) {
    return null
  }

  // Afficher "Devenir propriétaire" si : non connecté OU connecté mais pas propriétaire
  const showBecomeOwner = !user || user.role !== 'owner'
  
  // Afficher "Créer un hébergement" uniquement si : propriétaire connecté
  const showCreateProperty = user && user.role === 'owner'

  // Si aucun bouton à afficher, ne pas afficher la section
  if (!showBecomeOwner && !showCreateProperty) {
    return null
  }

  return (
    <section 
      className="relative py-16 sm:py-20 md:py-24 px-4 bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/hom4.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto max-w-7xl text-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 font-playfair" data-testid="text-owner-cta-title">
          {showCreateProperty ? 'Créez votre hébergement' : 'Vous possédez une habitation insolite ?'}
        </h2>
        <p className="text-center text-sm sm:text-base md:text-lg mb-8 sm:mb-12 max-w-3xl mx-auto px-2">
          {showCreateProperty 
            ? 'Partagez votre hébergement unique avec des voyageurs en quête d\'expériences authentiques.'
            : 'Rejoignez AtypikHouse et partagez votre hébergement unique avec des voyageurs en quête d\'expériences authentiques.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-6" data-testid="card-feature-management">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#FF8C00] flex items-center justify-center">
                <HomeIcon className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Gestion simplifiée</h3>
            <p className="text-center text-sm">
              Gérez facilement vos disponibilités et vos réservations depuis votre espace personnel.
            </p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-6" data-testid="card-feature-revenue">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#FF8C00] flex items-center justify-center">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Revenus complémentaires</h3>
            <p className="text-center text-sm">
              Fixez vos propres tarifs et générez des revenus grâce à votre bien atypique.
            </p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-6" data-testid="card-feature-security">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#FF8C00] flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Sécurité assurée</h3>
            <p className="text-center text-sm">
              Profitez de notre système de vérification des voyageurs et de notre assurance dédiée.
            </p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          {showBecomeOwner && (
            <Button className="bg-[#FF8C00] hover:bg-[#e67e00] text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg w-full sm:w-auto" asChild data-testid="button-cta-become-owner">
              <Link href="/host/register">
                Devenir propriétaire
              </Link>
            </Button>
          )}
          
          {showCreateProperty && (
            <Button className="bg-[#16A433] hover:bg-[#138a2c] text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg w-full sm:w-auto" asChild data-testid="button-cta-create-listing">
              <Link href="/owner/properties/new">
                Créer un hébergement
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
