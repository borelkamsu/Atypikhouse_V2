import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Shield, Heart, MapPin, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'À propos d\'AtypikHouse | Votre plateforme d\'hébergements insolites',
  description: 'Découvrez l\'histoire d\'AtypikHouse, notre mission et nos valeurs. Une SARL passionnée par les hébergements atypiques et les expériences authentiques.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-playfair">
            À propos d'AtypikHouse
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Une plateforme dédiée aux hébergements insolites et aux expériences authentiques
          </p>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-playfair text-center">
              Notre Histoire
            </h2>
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                AtypikHouse est une <strong>SARL</strong> fondée par trois passionnés de voyages, 
                d'habitat alternatif et de vie en harmonie avec la nature. Notre aventure a commencé 
                avec une vision simple : permettre à chacun de découvrir des expériences d'hébergement 
                uniques qui sortent de l'ordinaire.
              </p>
              <p className="text-lg leading-relaxed">
                Basés à <strong>Pierrefonds dans l'Oise</strong>, nous avons créé cette plateforme 
                pour mettre en relation des propriétaires d'habitations insolites avec des voyageurs 
                en quête d'authenticité et d'expériences inoubliables.
              </p>
              <p className="text-lg leading-relaxed">
                Que vous soyez à la recherche d'une cabane perchée dans les arbres, d'une yourte 
                traditionnelle, d'une habitation flottante ou d'un dôme transparent, nous vous 
                proposons une sélection rigoureuse de logements atypiques pour des séjours hors du commun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 font-playfair text-center">
            Notre Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 font-playfair">Expériences Authentiques</h3>
              <p className="text-gray-600">
                Connecter les voyageurs avec des hébergements uniques qui racontent une histoire 
                et créent des souvenirs inoubliables.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 font-playfair">Communauté de Confiance</h3>
              <p className="text-gray-600">
                Construire une communauté où propriétaires et voyageurs partagent leurs passions 
                dans un environnement sécurisé et bienveillant.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 font-playfair">Qualité et Sécurité</h3>
              <p className="text-gray-600">
                Garantir des hébergements vérifiés, des hôtes authentifiés et un support client 
                disponible pour votre tranquillité d'esprit.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 font-playfair text-center">
            Nos Valeurs
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Durabilité</h3>
                <p className="text-gray-700">
                  Nous privilégions les hébergements respectueux de l'environnement et encourageons 
                  un tourisme responsable.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Authenticité</h3>
                <p className="text-gray-700">
                  Chaque hébergement sélectionné offre une expérience unique et authentique, loin 
                  des sentiers battus.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-700">
                  Nous nous engageons à fournir un service de qualité et à répondre aux attentes 
                  de nos utilisateurs avec professionnalisme.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Proximité</h3>
                <p className="text-gray-700">
                  Notre équipe reste accessible et à l'écoute pour accompagner nos utilisateurs 
                  dans leurs aventures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informations Légales */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 font-playfair text-center">
            Informations Légales
          </h2>
          <Card className="p-6 sm:p-8">
            <div className="space-y-4 text-gray-700">
              <div>
                <strong className="text-gray-900">Raison sociale :</strong> AtypikHouse
              </div>
              <div>
                <strong className="text-gray-900">Forme juridique :</strong> Société à responsabilité limitée (SARL)
              </div>
              <div>
                <strong className="text-gray-900">Capital social :</strong> 10 000 euros
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-gray-900">Siège social :</strong> 123 Rue des Hirondelles, 60123 Pierrefonds, France
                </div>
              </div>
              <div>
                <strong className="text-gray-900">Numéro SIREN :</strong> 165438764
              </div>
              <div>
                <strong className="text-gray-900">Numéro SIRET :</strong> 16543876498765
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-playfair">
            Rejoignez l'aventure AtypikHouse
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Que vous soyez voyageur en quête d'expériences uniques ou propriétaire d'un hébergement insolite, 
            découvrez comment AtypikHouse peut vous accompagner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-white" asChild>
              <Link href="/properties">
                Découvrir les hébergements
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary" asChild>
              <Link href="/host">
                Devenir hôte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

