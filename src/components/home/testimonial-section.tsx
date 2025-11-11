export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Marie Dubois",
      location: "Paris, France",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Une expérience magique dans la cabane dans les arbres ! Le réveil avec les oiseaux était incroyable. Je recommande vivement AtypikHouse."
    },
    {
      id: 2,
      name: "Pierre Martin",
      location: "Lyon, France",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "La yourte était parfaite pour notre escapade romantique. L'isolation et le confort étaient au rendez-vous. Un moment inoubliable !"
    },
    {
      id: 3,
      name: "Sophie Leroy",
      location: "Marseille, France",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Le dôme transparent était un rêve ! Observer les étoiles depuis son lit, c'était magique. L'équipe AtypikHouse est aux petits soins."
    }
  ]

  return (
    <section className="py-16 bg-primary-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair font-bold text-3xl text-gray-900 mb-4">Ce que disent nos voyageurs</h2>
          <p className="text-gray-600">Découvrez les témoignages de ceux qui ont vécu des expériences uniques</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}