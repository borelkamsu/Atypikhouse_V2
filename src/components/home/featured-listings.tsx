import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const FeaturedListings = () => {
  // Données de démonstration pour les hébergements en vedette
  const featuredProperties = [
    {
      id: 1,
      name: "Cabane perchée dans les cèdres",
      location: "Forêt de Brocéliande, France",
      price: 120,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      rating: 4.9,
      reviews: 24
    },
    {
      id: 2,
      name: "Yourte traditionnelle mongole",
      location: "Montagne Noire, France",
      price: 95,
      image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      rating: 4.8,
      reviews: 18
    },
    {
      id: 3,
      name: "Dôme transparent sous les étoiles",
      location: "Cévennes, France",
      price: 150,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      rating: 4.9,
      reviews: 32
    }
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-2">Nos hébergements exceptionnels</h2>
        <p className="text-gray-600 mb-8">Découvrez notre sélection d'habitations insolites</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div 
                className="h-64 bg-cover bg-center" 
                style={{ backgroundImage: `url('${property.image}')` }}
              />
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-playfair font-medium text-lg text-gray-900">{property.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{property.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-primary-light text-primary-dark px-3 py-1 rounded-full text-sm">Insolite</span>
                  <span className="bg-secondary-light text-secondary-dark px-3 py-1 rounded-full text-sm">Nature</span>
                  <span className="bg-accent-light text-accent-dark px-3 py-1 rounded-full text-sm">Unique</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">€{property.price}/nuit</span>
                  <span className="text-sm text-gray-500">{property.reviews} avis</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" className="border-2 border-primary" asChild>
            <Link href="/properties">
              Voir tous les hébergements
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedListings