'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, MapPin, Users, Bed, Bath, Calendar, Heart, Share2 } from 'lucide-react'

interface Property {
  _id: string
  title: string
  description: string
  type: string
  location: {
    address: string
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
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
  amenities: string[]
  images: string[]
  rating: number
  isAvailable: boolean
  owner: {
    _id: string
    firstName: string
    lastName: string
  }
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: 1
  })
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProperty()
      checkFavorite()
    }
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
      } else {
        router.push('/properties')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la propriété:', error)
      router.push('/properties')
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    try {
      const response = await fetch(`/api/favorites/${params.id}/check`)
      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data.isFavorited)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error)
    }
  }

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await fetch(`/api/favorites/${params.id}`, { method: 'DELETE' })
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId: params.id })
        })
      }
      setIsFavorited(!isFavorited)
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error)
    }
  }

  const handleBooking = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: params.id,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          guests: bookingData.guests
        })
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const error = await response.json()
        alert(error.message || 'Erreur lors de la réservation')
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error)
      alert('Erreur lors de la réservation')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Propriété non trouvée
          </h1>
          <Button onClick={() => router.push('/properties')}>
            Retour aux propriétés
          </Button>
        </div>
      </div>
    )
  }

  const calculateTotalPrice = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return days * property.price.perNight
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Images */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>Aucune image</span>
                </div>
              )}
            </div>
            
            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video bg-gray-200 rounded overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Réservation */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {property.price.perNight}€
                    </span>
                    <span className="text-gray-600"> / nuit</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{property.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Arrivée</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Départ</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={bookingData.endDate}
                      onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests">Voyageurs</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={property.capacity.guests}
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                  />
                </div>

                {calculateTotalPrice() > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>{calculateTotalPrice()}€</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  className="w-full"
                  disabled={!bookingData.startDate || !bookingData.endDate}
                >
                  Réserver
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Détails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{property.title}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location.address}, {property.location.city}, {property.location.country}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={toggleFavorite}>
                      <Heart className={`h-4 w-4 mr-1 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                      {isFavorited ? 'Favori' : 'Ajouter aux favoris'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gray-600" />
                    <span>{property.capacity.guests} voyageurs</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-gray-600" />
                    <span>{property.capacity.bedrooms} chambre{property.capacity.bedrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-gray-600" />
                    <span>{property.capacity.bathrooms} salle{property.capacity.bathrooms > 1 ? 's' : ''} de bain</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="secondary">{property.type}</Badge>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Équipements</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="justify-start">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Informations supplémentaires */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Propriétaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {property.owner.firstName[0]}{property.owner.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {property.owner.firstName} {property.owner.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Propriétaire</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Règles de la maison</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Arrivée après 15h00</li>
                  <li>• Départ avant 11h00</li>
                  <li>• Animaux acceptés</li>
                  <li>• Fumeurs acceptés</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
