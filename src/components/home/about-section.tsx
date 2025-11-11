export default function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-8">À propos d'AtypikHouse</h2>
          <p className="text-lg text-gray-600 mb-8">
            AtypikHouse est votre plateforme de référence pour découvrir et réserver 
            des logements insolites et uniques. Nous connectons les voyageurs en quête 
            d'expériences authentiques avec des hôtes passionnés qui partagent leur 
            amour pour l'extraordinaire.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <h3 className="font-playfair font-semibold text-xl mb-2">Expériences uniques</h3>
              <p className="text-gray-600">Des séjours qui sortent de l'ordinaire</p>
            </div>
            <div className="text-center">
              <h3 className="font-playfair font-semibold text-xl mb-2">Hôtes vérifiés</h3>
              <p className="text-gray-600">Une communauté de confiance</p>
            </div>
            <div className="text-center">
              <h3 className="font-playfair font-semibold text-xl mb-2">Support 24/7</h3>
              <p className="text-gray-600">Une assistance toujours disponible</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
