import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Users, Star, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
          
          {/* Search Bar */}
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

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-heading">
            Types d'habitations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-shadow border-gray-200">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <CardTitle className="font-heading">Cabanes</CardTitle>
                <CardDescription className="font-body">
                  Dormez dans les arbres et profitez d'une vue imprenable sur la nature.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-xl transition-shadow border-gray-200">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⛺</span>
                </div>
                <CardTitle className="font-heading">Yourtes</CardTitle>
                <CardDescription className="font-body">
                  Expérimentez le confort moderne dans une habitation traditionnelle.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-xl transition-shadow border-gray-200">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🚤</span>
                </div>
                <CardTitle className="font-heading">Maisons flottantes</CardTitle>
                <CardDescription className="font-body">
                  Vivez au rythme de l'eau dans une habitation unique sur l'eau.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-heading">
            Habitations en vedette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="group hover:shadow-xl transition-shadow border-gray-200">
                <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg font-heading">Habitation {i}</h3>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-gray-600 mb-4 font-body">
                    Description de l'habitation avec ses caractéristiques uniques.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm">4.8</span>
                    </div>
                    <span className="font-bold text-primary">120€/nuit</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
