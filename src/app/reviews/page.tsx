import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, ArrowLeft, Quote } from 'lucide-react';

export const metadata = {
  title: 'Tous les avis | AtypikHouse',
  description: 'Découvrez tous les avis et témoignages de nos voyageurs qui ont séjourné dans nos hébergements insolites.',
};

// Témoignages étendus (vous pouvez remplacer par des données de votre base de données plus tard)
const testimonials = [
  {
    name: 'Sophie L.',
    date: 'Mai 2024',
    rating: 5,
    comment: 'Une expérience inoubliable dans une cabane perchée. Le cadre est magnifique et l\'hôte très accueillant. Nous recommandons vivement !',
    location: 'Fontainebleau, France',
    propertyType: 'Cabane dans les arbres'
  },
  {
    name: 'Thomas R.',
    date: 'Avril 2024',
    rating: 5,
    comment: 'Notre séjour en yourte était exceptionnel. Un vrai retour à la nature avec tout le confort moderne. L\'emplacement est parfait pour se ressourcer.',
    location: 'Normandie, France',
    propertyType: 'Yourte'
  },
  {
    name: 'Émilie D.',
    date: 'Juin 2024',
    rating: 5,
    comment: 'La cabane flottante offre une vue incroyable. Un moment de détente absolue loin du stress quotidien. Le petit-déjeuner sur la terrasse est magique.',
    location: 'Annecy, France',
    propertyType: 'Maison flottante'
  },
  {
    name: 'Marc P.',
    date: 'Mars 2024',
    rating: 5,
    comment: 'Le dôme transparent était un rêve éveillé ! Observer les étoiles depuis son lit est une expérience unique. L\'accueil et les équipements sont parfaits.',
    location: 'Alpes, France',
    propertyType: 'Dôme transparent'
  },
  {
    name: 'Julie M.',
    date: 'Février 2024',
    rating: 4,
    comment: 'Très belle expérience dans cette cabane insolite. L\'isolation est excellente et le confort au rendez-vous. Petit bémol sur l\'accès un peu escarpé.',
    location: 'Pyrénées, France',
    propertyType: 'Cabane nature'
  },
  {
    name: 'David F.',
    date: 'Janvier 2024',
    rating: 5,
    comment: 'Séjour romantique parfait ! La yourte est spacieuse, bien décorée et chaleureuse. Le poêle à bois ajoute une touche magique. Nous reviendrons !',
    location: 'Ardèche, France',
    propertyType: 'Yourte de luxe'
  },
  {
    name: 'Laura B.',
    date: 'Décembre 2023',
    rating: 5,
    comment: 'Expérience fantastique en famille ! Les enfants ont adoré la cabane dans les arbres. L\'hôte est très attentionné et le cadre idyllique.',
    location: 'Vosges, France',
    propertyType: 'Cabane familiale'
  },
  {
    name: 'Pierre C.',
    date: 'Novembre 2023',
    rating: 4,
    comment: 'Très bon séjour dans cette habitation originale. L\'emplacement est calme et reposant. Quelques améliorations possibles au niveau de l\'équipement.',
    location: 'Bretagne, France',
    propertyType: 'Roulotte aménagée'
  },
  {
    name: 'Marie K.',
    date: 'Octobre 2023',
    rating: 5,
    comment: 'Un vrai coup de cœur ! La vue depuis la maison flottante est à couper le souffle. L\'équipement est complet et le service irréprochable.',
    location: 'Lac du Bourget, France',
    propertyType: 'Maison flottante'
  },
  {
    name: 'Antoine L.',
    date: 'Septembre 2023',
    rating: 5,
    comment: 'Séjour parfait pour une escapade nature. La cabane est confortable et bien équipée. L\'environnement forestier est apaisant. Merci pour ce moment !',
    location: 'Forêt de Compiègne, France',
    propertyType: 'Cabane écologique'
  },
  {
    name: 'Camille R.',
    date: 'Août 2023',
    rating: 5,
    comment: 'Expérience magique sous les étoiles ! Le dôme offre une vue panoramique incroyable. Le confort est excellent et l\'accueil chaleureux.',
    location: 'Provence, France',
    propertyType: 'Dôme géodésique'
  },
  {
    name: 'Nicolas T.',
    date: 'Juillet 2023',
    rating: 4,
    comment: 'Très belle yourte dans un cadre magnifique. L\'espace est bien agencé et le poêle efficace. Parfait pour se déconnecter quelques jours.',
    location: 'Auvergne, France',
    propertyType: 'Yourte traditionnelle'
  }
];

export default function ReviewsPage() {
  // Calculer la note moyenne
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const fiveStarCount = testimonials.filter(t => t.rating === 5).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-playfair">
            Tous les avis
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
            Découvrez les expériences authentiques de nos voyageurs
          </p>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
              </div>
              <p className="text-gray-600">Note moyenne sur {testimonials.length} avis</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl font-bold text-primary">{fiveStarCount}</p>
              <p className="text-gray-600">Avis 5 étoiles</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl font-bold text-primary">{testimonials.length}</p>
              <p className="text-gray-600">Avis au total</p>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des avis */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.date}</p>
                    </div>
                  </div>
                  <Quote className="h-6 w-6 text-primary/20" />
                </div>

                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {testimonial.comment}
                </p>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{testimonial.propertyType}</span>
                    {' • '}
                    {testimonial.location}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-playfair">
            Partagez votre expérience
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Vous avez séjourné dans l'un de nos hébergements ? Partagez votre avis et aidez d'autres voyageurs à découvrir des expériences uniques !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-white" asChild>
              <Link href="/properties">
                Découvrir nos hébergements
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary" asChild>
              <Link href="/bookings">
                Mes réservations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


