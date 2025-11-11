import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface CategoryProps {
  image: string
  title: string
  description: string
  link: string
}

const categories: CategoryProps[] = [
  {
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    title: "Cabanes dans les arbres",
    description: "Vivez une expérience unique en hauteur",
    link: "/properties?type=cabin",
  },
  {
    image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    title: "Yourtes",
    description: "Immergez-vous dans la tradition nomade",
    link: "/properties?type=yurt",
  },
  {
    image: "https://images.unsplash.com/photo-1470010762743-1fa2363f65ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    title: "Cabanes flottantes",
    description: "Détendez-vous au fil de l'eau",
    link: "/properties?type=floating",
  },
  {
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    title: "Dômes",
    description: "L'essentiel dans un espace optimisé",
    link: "/properties?type=dome",
  },
]

const CategoryCard = ({ image, title, description, link }: CategoryProps) => {
  return (
    <Link href={link} className="group block">
      <Card className="overflow-hidden shadow-md transition transform hover:scale-105 duration-300">
        <div 
          className="h-48 bg-cover bg-center" 
          style={{ backgroundImage: `url('${image}')` }}
        />
        <CardContent className="p-4 bg-white">
          <h3 className="font-playfair font-medium text-lg text-gray-900 group-hover:text-primary">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function CategorySection() {
  return (
    <section className="py-12 container mx-auto px-4">
      <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-2">Explorez nos types d'hébergements</h2>
      <p className="text-gray-600 mb-8">Des habitations insolites pour une expérience en harmonie avec la nature</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={index} {...category} />
        ))}
      </div>
    </section>
  )
}