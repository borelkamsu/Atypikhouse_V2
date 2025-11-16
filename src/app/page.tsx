import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Home as HomeIcon, DollarSign, Shield, ArrowRight } from 'lucide-react';
import { SearchForm } from '@/components/home/search-form';
import connectDB from '@/lib/db/mongodb';
import { Property } from '@/models/property';
import { Booking } from '@/models/booking';

export const dynamic = 'force-dynamic';

// Types
interface PropertyType {
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

// Fetch propriétés en vedette (les 3 plus récemment réservées)
async function getFeaturedProperties(): Promise<PropertyType[]> {
  try {
    await connectDB();
    
    const recentBookings = await Booking.find({ status: { $ne: 'cancelled' } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('propertyId')
      .lean();

    const propertyIds = recentBookings
      .map((booking: any) => booking.propertyId?._id)
      .filter((id: any) => id);

    const uniquePropertyIds = [...new Set(propertyIds)].slice(0, 3);

    const properties = await Property.find({
      _id: { $in: uniquePropertyIds },
      isAvailable: true
    }).limit(3).lean();

    return properties.map((prop: any) => ({
      _id: prop._id.toString(),
      title: prop.title,
      description: prop.description,
      type: prop.type,
      location: prop.location,
      price: prop.price,
      images: prop.images || [],
      rating: prop.rating || 0
    }));
  } catch (error) {
    console.error('Erreur getFeaturedProperties:', error);
    return [];
  }
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  // Types d'hébergements
  const propertyTypes = [
    {
      title: 'Cabanes dans les arbres',
      description: 'Vivez une expérience unique en hauteur',
      image: '/images/treehouse_cabin_in_f_91e06274.jpg',
      type: 'cabin'
    },
    {
      title: 'Yourtes',
      description: 'Immergez-vous dans la tradition nomade',
      image: '/images/yurt_tent_nomadic_ac_d9740ee1.jpg',
      type: 'yurt'
    },
    {
      title: 'Cabanes flottantes',
      description: 'Détendez-vous au fil de l\'eau',
      image: '/images/floating_house_on_wa_48f9049d.jpg',
      type: 'floating'
    },
    {
      title: 'Tiny houses',
      description: 'L\'essentiel dans un espace optimisé',
      image: '/images/tiny_house_small_mod_a87ff2d2.jpg',
      type: 'tiny'
    }
  ];

  // Témoignages
  const testimonials = [
    {
      name: 'Sophie L.',
      date: 'Mai 2023',
      rating: 5,
      comment: 'Une expérience inoubliable dans une cabane perchée. Le cadre est magnifique et l\'hôte très accueillant.',
      avatar: '/images/avatar1.jpg'
    },
    {
      name: 'Thomas R.',
      date: 'Avril 2023',
      rating: 5,
      comment: 'Notre séjour en yourte était exceptionnel. Un vrai retour à la nature avec tout le confort moderne.',
      avatar: '/images/avatar2.jpg'
    },
    {
      name: 'Émilie D.',
      date: 'Juin 2023',
      rating: 5,
      comment: 'La cabane flottante offre une vue incroyable. Un moment de détente absolue loin du stress quotidien.',
      avatar: '/images/avatar3.jpg'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] md:h-[700px] bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(/images/land1_1763311281085.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 font-playfair" data-testid="text-hero-title">
            Des habitations insolites<br />pour des séjours<br />inoubliables
          </h1>
          <p className="text-lg md:text-xl text-center mb-12 max-w-3xl" data-testid="text-hero-subtitle">
            Découvrez nos cabanes dans les arbres, yourtes et habitations flottantes en harmonie avec la nature.
          </p>
          
          <SearchForm />
        </div>
      </section>

      {/* Explorez nos types d'hébergements */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 font-playfair" data-testid="text-types-title">
            Explorez nos types d'hébergements
          </h2>
          <p className="text-center text-gray-600 mb-12" data-testid="text-types-subtitle">
            Des habitations insolites pour une expérience en harmonie avec la nature
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((type, index) => (
              <Link href={`/properties?type=${type.type}`} key={index}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300" data-testid={`card-type-${type.type}`}>
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2" data-testid={`text-type-title-${type.type}`}>
                      {type.title}
                    </h3>
                    <p className="text-gray-600" data-testid={`text-type-description-${type.type}`}>
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nos hébergements exceptionnels */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 font-playfair" data-testid="text-featured-title">
            Nos hébergements exceptionnels
          </h2>

          {featuredProperties.length === 0 ? (
            <p className="text-red-500" data-testid="text-no-featured">
              Une erreur est survenue lors du chargement des propriétés.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <Link href={`/properties/${property._id}`} key={property._id}>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300" data-testid={`card-featured-${property._id}`}>
                    <div className="relative h-64 bg-gray-200">
                      {property.images[0]?.url && (
                        <img
                          src={property.images[0].url}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2" data-testid={`text-featured-title-${property._id}`}>
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{property.location.city}, {property.location.country}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="ml-1 font-semibold">{property.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {property.price.perNight} {property.price.currency}/nuit
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* À propos d'AtypikHouse */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair" data-testid="text-about-title">
                À propos d'AtypikHouse
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                AtypikHouse est une SARL fondée par trois passionnés de voyages, d'habitat alternatif et de vie en harmonie avec la nature. Notre mission est de vous proposer des expériences d'hébergement uniques à travers la France et l'Europe.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Basés à Pierrefonds dans l'Oise, nous mettons en relation des propriétaires d'habitations insolites avec des voyageurs en quête d'authenticité et d'expériences inoubliables.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Que vous soyez à la recherche d'une cabane perchée dans les arbres, d'une yourte traditionnelle ou d'une habitation flottante, nous vous proposons une sélection rigoureuse de logements atypiques pour des séjours hors du commun.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" asChild data-testid="button-learn-more">
                  <Link href="/about">
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button className="bg-[#FF8C00] hover:bg-[#e67e00] text-white" asChild data-testid="button-become-owner">
                  <Link href="/owner/register">
                    Devenir propriétaire
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/images/land3_1763311281083.jpg"
                  alt="Cabane dans les arbres"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/images/land3_1763311281083.jpg"
                  alt="Piscine moderne"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ce que disent nos voyageurs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair" data-testid="text-testimonials-title">
            Ce que disent nos voyageurs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6" data-testid={`card-testimonial-${index}`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-xl font-bold text-white">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold" data-testid={`text-testimonial-name-${index}`}>
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.date}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700" data-testid={`text-testimonial-comment-${index}`}>
                  {testimonial.comment}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" data-testid="button-all-reviews">
              Voir tous les avis
            </Button>
          </div>
        </div>
      </section>

      {/* Vous possédez une habitation insolite ? */}
      <section 
        className="relative py-24 px-4 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/land4_1763311281082.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto max-w-7xl text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-playfair" data-testid="text-owner-cta-title">
            Vous possédez une habitation insolite ?
          </h2>
          <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
            Rejoignez AtypikHouse et partagez votre hébergement unique avec des voyageurs en quête d'expériences authentiques.
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
                Profitez de notre système de vérification des voyageurs et de notre assurance décliée.
              </p>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button className="bg-[#FF8C00] hover:bg-[#e67e00] text-white px-8 py-6 text-lg" asChild data-testid="button-cta-become-owner">
              <Link href="/owner/register">
                Devenir propriétaire
              </Link>
            </Button>
            <Button className="bg-[#16A433] hover:bg-[#138a2c] text-white px-8 py-6 text-lg" asChild data-testid="button-cta-create-listing">
              <Link href="/owner/properties/new">
                Créer un hébergement
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
