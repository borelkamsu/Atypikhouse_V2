import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BecomeHostSection() {
  return (
    <section className="py-16 bg-primary-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-playfair font-bold text-3xl text-white mb-6">Devenez hôte AtypikHouse</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Partagez votre logement insolite et gagnez un revenu supplémentaire 
          tout en faisant découvrir votre passion aux voyageurs du monde entier.
        </p>
        <Button size="lg" className="bg-white text-primary-dark hover:bg-gray-100 px-8 py-3 text-lg font-medium" asChild>
          <Link href="/host">
            Commencer à louer
          </Link>
        </Button>
      </div>
    </section>
  )
}