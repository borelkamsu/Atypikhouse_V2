import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Users, Bed, Bath, Share2 } from 'lucide-react'
import { getPropertyById, checkFavorite } from '@/lib/server/properties'
import FavoriteButton from '@/components/properties/favorite-button'
import BookingForm from '@/components/properties/booking-form'

interface PageProps {
  params: {
    id: string
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  // Fetch des données côté serveur
  const property = await getPropertyById(params.id)
  
  if (!property) {
    notFound()
  }

  // Vérifier si favoris (optionnel, ne pas bloquer si non connecté)
  const isFavorited = await checkFavorite(params.id)

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      cabin: 'Cabane dans les arbres',
      yurt: 'Yourte',
      floating: 'Logement flottant',
      dome: 'Dôme',
      caravan: 'Caravane',
      igloo: 'Igloo',
      other: 'Autre'
    }
    return types[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                data-testid="text-property-title"
              >
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold" data-testid="text-rating">
                    {property.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span data-testid="text-location">
                    {property.location.city}, {property.location.country}
                  </span>
                </div>
                <Badge>{getTypeLabel(property.type)}</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" data-testid="button-share">
                <Share2 className="h-5 w-5" />
              </Button>
              <FavoriteButton 
                propertyId={params.id} 
                initialIsFavorited={isFavorited}
              />
            </div>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <>
              <div className="md:row-span-2">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  data-testid="img-property-main"
                />
              </div>
              {property.images.slice(1, 5).map((image, index) => (
                <div key={index} className="h-48 md:h-auto">
                  <img
                    src={image}
                    alt={`${property.title} - ${index + 2}`}
                    className="w-full h-full object-cover"
                    data-testid={`img-property-${index + 1}`}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="col-span-2 h-96 bg-gray-200 flex items-center justify-center">
              <MapPin className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informations générales */}
            <Card className="p-6">
              <div className="border-b pb-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Informations sur le logement</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold" data-testid="text-guests">
                        {property.capacity.guests} voyageurs
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold" data-testid="text-bedrooms">
                        {property.capacity.bedrooms} chambre{property.capacity.bedrooms > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold" data-testid="text-bathrooms">
                        {property.capacity.bathrooms} salle{property.capacity.bathrooms > 1 ? 's' : ''} de bain
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b pb-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed" data-testid="text-description">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Équipements</h3>
                {property.amenities && property.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                        data-testid={`text-amenity-${index}`}
                      >
                        <span className="text-primary">✓</span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun équipement spécifié</p>
                )}
              </div>
            </Card>

            {/* Localisation */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Localisation</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Adresse:</span> {property.location.address}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Ville:</span> {property.location.city}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Pays:</span> {property.location.country}
                </p>
              </div>
            </Card>

            {/* Propriétaire */}
            {property.owner && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Propriétaire</h3>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg" data-testid="text-owner-name">
                      {property.owner.firstName} {property.owner.lastName}
                    </p>
                    <p className="text-gray-600">Hôte AtypikHouse</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Formulaire de réservation */}
          <div className="lg:col-span-1">
            <BookingForm 
              propertyId={params.id}
              pricePerNight={property.price.perNight}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
