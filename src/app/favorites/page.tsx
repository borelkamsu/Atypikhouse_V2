"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Star, MapPin, Users, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Property {
  _id: string
  title: string
  description: string
  type: string
  location: {
    address: string
    city: string
    country: string
  }
  price: {
    perNight: number
    currency: string
  }
  capacity: {
    guests: number
    bedrooms: number
    bathrooms: number
  }
  images: string[]
  rating: number
  isAvailable: boolean
}

interface Favorite {
  _id: string
  propertyId: Property
  createdAt: string
}

export default function FavoritesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites')
        if (response.ok) {
          const data = await response.json()
          setFavorites(data)
        } else if (response.status === 401) {
          router.push('/auth')
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger vos favoris",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger vos favoris",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [router, toast])

  const removeFavorite = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.propertyId._id !== propertyId))
        toast({
          title: "Favori supprimé",
          description: "La propriété a été retirée de vos favoris",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le favori",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le favori",
        variant: "destructive",
      })
    }
  }

  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'cabin': 'Cabane',
      'yurt': 'Yourte',
      'floating': 'Maison flottante',
      'treehouse': 'Maison dans les arbres',
      'cave': 'Grotte',
      'igloo': 'Igloo',
      'tent': 'Tente de luxe'
    }
    return types[type] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes Favoris</h1>
          <p className="text-muted-foreground mt-2">
            {favorites.length} propriété{favorites.length !== 1 ? 's' : ''} dans vos favoris
          </p>
        </div>
        <Button onClick={() => router.push('/properties')}>
          Découvrir plus de propriétés
        </Button>
      </div>

      {favorites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun favori pour le moment</h3>
            <p className="text-muted-foreground mb-4">
              Explorez nos propriétés atypiques et ajoutez-les à vos favoris pour les retrouver facilement.
            </p>
            <Button onClick={() => router.push('/properties')}>
              Découvrir les propriétés
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <Card key={favorite._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={favorite.propertyId.images[0] || '/images/placeholder.jpg'}
                  alt={favorite.propertyId.title}
                  className="w-full h-48 object-cover"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => removeFavorite(favorite.propertyId._id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-2 left-2">
                  {getPropertyTypeLabel(favorite.propertyId.type)}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{favorite.propertyId.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {favorite.propertyId.location.city}, {favorite.propertyId.location.country}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{favorite.propertyId.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {favorite.propertyId.capacity.guests} voyageurs
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      €{favorite.propertyId.price.perNight}
                    </span>
                    <span className="text-muted-foreground"> / nuit</span>
                  </div>
                  <Button 
                    onClick={() => router.push(`/properties/${favorite.propertyId._id}`)}
                    size="sm"
                  >
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


