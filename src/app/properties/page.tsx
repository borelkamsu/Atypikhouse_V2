import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Users } from 'lucide-react'
import { getProperties, type Property } from '@/lib/server/properties'
import FiltersWrapper from '@/components/properties/filters-wrapper'

interface PageProps {
  searchParams: {
    search?: string
    type?: string
    city?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  // Fetch des données côté serveur (SSR)
  const data = await getProperties({
    search: searchParams.search,
    type: searchParams.type,
    city: searchParams.city,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    page: searchParams.page ? parseInt(searchParams.page) : 1
  })

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      cabin: 'Cabane',
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4" data-testid="text-page-title">
            Découvrez nos Logements Atypiques
          </h1>
          <p className="text-lg md:text-xl text-center opacity-90 max-w-2xl mx-auto">
            Trouvez votre prochaine aventure dans un logement unique et mémorable
          </p>
        </div>
      </div>

      {/* Filtres - Client Component wrapper */}
      <div className="container mx-auto px-4 py-8">
        <FiltersWrapper 
          initialSearch={searchParams.search}
          initialType={searchParams.type}
          initialCity={searchParams.city}
          initialMinPrice={searchParams.minPrice}
          initialMaxPrice={searchParams.maxPrice}
        />

        {/* Résultats - SSR */}
        <div className="mb-6">
          <p className="text-gray-600" data-testid="text-results-count">
            {data.pagination.total} logement{data.pagination.total > 1 ? 's' : ''} trouvé{data.pagination.total > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille de propriétés - SSR */}
        {data.properties.length === 0 ? (
          <div className="text-center py-16" data-testid="text-no-results">
            <p className="text-xl text-gray-600 mb-4">Aucun logement trouvé</p>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.properties.map((property: Property) => (
              <Link 
                key={property._id} 
                href={`/properties/${property._id}`}
                data-testid={`card-property-${property._id}`}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                  {/* Image */}
                  <div className="relative h-64 bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        data-testid={`img-property-${property._id}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <MapPin className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Badge Type */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white text-primary border-none shadow-md">
                        {getTypeLabel(property.type)}
                      </Badge>
                    </div>
                    
                    {/* Badge Disponibilité */}
                    {!property.isAvailable && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive">
                          Non disponible
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    {/* Titre et Rating */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="font-playfair font-semibold text-lg text-gray-900 flex-1 mr-2 line-clamp-2"
                        data-testid={`text-property-title-${property._id}`}
                      >
                        {property.title}
                      </h3>
                      <div className="flex items-center flex-shrink-0">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">
                          {property.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm" data-testid={`text-property-location-${property._id}`}>
                        {property.location.city}, {property.location.country}
                      </span>
                    </div>

                    {/* Capacité */}
                    <div className="flex items-center text-gray-600 mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {property.capacity.guests} voyageur{property.capacity.guests > 1 ? 's' : ''} · {' '}
                        {property.capacity.bedrooms} chambre{property.capacity.bedrooms > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Description courte */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    {/* Prix */}
                    <div className="border-t pt-4">
                      <div className="flex items-baseline">
                        <span 
                          className="text-2xl font-bold text-primary"
                          data-testid={`text-property-price-${property._id}`}
                        >
                          €{property.price.perNight}
                        </span>
                        <span className="text-gray-600 ml-1">/nuit</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination - SSR */}
        {data.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/properties?${new URLSearchParams({ ...searchParams, page: page.toString() }).toString()}`}
                className={`px-4 py-2 rounded-md ${
                  page === data.pagination.page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                data-testid={`link-page-${page}`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
