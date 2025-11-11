'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Star, MapPin, Users, Heart, Search, Filter } from 'lucide-react'

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

export default function PropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedType) params.append('type', selectedType)
      if (selectedCity) params.append('city', selectedCity)
      if (priceRange.min) params.append('minPrice', priceRange.min)
      if (priceRange.max) params.append('maxPrice', priceRange.max)

      const response = await fetch(`/api/properties?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des propriétés:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setLoading(true)
    fetchProperties()
  }

  const propertyTypes = [
    { value: 'cabin', label: 'Cabane' },
    { value: 'yurt', label: 'Yourte' },
    { value: 'floating', label: 'Logement flottant' },
    { value: 'dome', label: 'Dôme' },
    { value: 'caravan', label: 'Caravane' },
    { value: 'igloo', label: 'Igloo' },
    { value: 'other', label: 'Autre' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">
            Découvrez nos Logements Atypiques
          </h1>
          <p className="text-xl text-center opacity-90 max-w-2xl mx-auto">
            Trouvez votre prochaine aventure dans un logement unique et mémorable
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <option value="">Tous les types</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <Input
                placeholder="Ville"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix min (€)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix max (€)
              </label>
              <Input
                type="number"
                placeholder="1000"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button onClick={handleSearch} className="px-8">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </div>

        {/* Liste des propriétés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-gray-200 relative">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>Aucune image</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90">
                    {property.type}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{property.rating}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location.city}, {property.location.country}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {property.capacity.guests} voyageurs
                  </div>
                  <div>
                    {property.capacity.bedrooms} chambre{property.capacity.bedrooms > 1 ? 's' : ''}
                  </div>
                  <div>
                    {property.capacity.bathrooms} salle{property.capacity.bathrooms > 1 ? 's' : ''} de bain
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {property.price.perNight}€
                    </span>
                    <span className="text-gray-600"> / nuit</span>
                  </div>
                  <Button
                    onClick={() => router.push(`/properties/${property._id}`)}
                    size="sm"
                  >
                    Voir les détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
