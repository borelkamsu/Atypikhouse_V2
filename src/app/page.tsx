import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Users, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FavoriteButton } from '@/components/property/favorite-button';

// Types pour les données
interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  location: {
    city: string;
    country: string;
  };
  price: {
    perNight: number;
    currency: string;
  };
  images: Array<{ url: string; publicId: string }>;
  rating: number;
}

interface Category {
  type: string;
  title: string;
  description: string;
  count: number;
}

// Fetch des propriétés en vedette (SSR)
async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
    const res = await fetch(`${baseUrl}/api/properties/featured?limit=6`, {
      cache: 'no-store' // Toujours récupérer les données fraîches
    });
    
    if (!res.ok) {
      console.error('Erreur lors de la récupération des propriétés en vedette');
      return [];
    }
    
    const data = await res.json();
    return data.properties || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés en vedette:', error);
    return [];
  }
}

// Fetch des catégories (SSR)
async function getCategories(): Promise<Category[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
    const res = await fetch(`${baseUrl}/api/properties/categories`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Erreur lors de la récupération des catégories');
      return [];
    }
    
    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
}

export default async function Home() {
  // Fetch des données côté serveur (SSR)
  const [featuredProperties, categories] = await Promise.all([
    getFeaturedProperties(),
    getCategories()
  ]);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-heading">
            Découvrez des{' '}
            <span className="text-primary">habitations insolites</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-body">
            Vivez des expériences uniques dans des cabanes, yourtes, maisons flottantes 
            et autres habitations atypiques en harmonie avec la nature.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-lg">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Où voulez-vous aller ?" 
                    className="pl-10 border-0 focus:ring-0 text-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    type="date" 
                    className="pl-10 border-0 focus:ring-0"
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Voyageurs" 
                    className="pl-10 w-32 border-0 focus:ring-0"
                  />
                </div>
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary-dark">
                <Search className="mr-2 h-5 w-5" />
                Rechercher
              </Button>
            </div>
          </div>
          
          <Link href="/properties">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              Voir toutes les habitations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Types d'habitations - VRAIES CATÉGORIES */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-heading">
            Types d'habitations
          </h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 6).map((category) => (
                <Link 
                  key={category.type} 
                  href={`/properties?type=${category.type}`}
                  data-testid={`category-${category.type}`}
                >
                  <Card className="group hover:shadow-xl transition-shadow border-gray-200 cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="font-heading flex items-center justify-between">
                        {category.title}
                        <span className="text-sm text-gray-500 font-normal">
                          {category.count} {category.count > 1 ? 'propriétés' : 'propriété'}
                        </span>
                      </CardTitle>
                      <CardDescription className="font-body">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Aucune catégorie disponible pour le moment.</p>
          )}
        </div>
      </section>

      {/* Habitations en vedette - PROPRIÉTÉS LES PLUS RÉSERVÉES */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-heading">
            Habitations en vedette
          </h2>
          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProperties.slice(0, 6).map((property) => (
                <Card 
                  key={property._id} 
                  className="group hover:shadow-xl transition-shadow border-gray-200 overflow-hidden"
                  data-testid={`featured-property-${property._id}`}
                >
                  <Link href={`/properties/${property._id}`}>
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      {property.images && property.images.length > 0 ? (
                        <Image
                          src={property.images[0].url}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-gray-400">Pas d'image</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Link href={`/properties/${property._id}`}>
                        <h3 className="font-semibold text-lg font-heading hover:text-primary transition-colors line-clamp-1">
                          {property.title}
                        </h3>
                      </Link>
                      <FavoriteButton propertyId={property._id} />
                    </div>
                    <Link href={`/properties/${property._id}`}>
                      <p className="text-gray-600 mb-2 font-body text-sm">
                        {property.location.city}, {property.location.country}
                      </p>
                      <p className="text-gray-600 mb-4 font-body line-clamp-2">
                        {property.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm">{property.rating?.toFixed(1) || 'Nouveau'}</span>
                        </div>
                        <span className="font-bold text-primary">
                          {property.price.perNight}€/nuit
                        </span>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Aucune propriété disponible pour le moment.</p>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-heading">
            Prêt pour l'aventure ?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto font-body">
            Rejoignez des milliers de voyageurs qui ont déjà découvert 
            des séjours inoubliables avec AtypikHouse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="bg-secondary hover:bg-secondary-dark">
                Créer un compte
              </Button>
            </Link>
            <Link href="/properties">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Explorer les habitations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
