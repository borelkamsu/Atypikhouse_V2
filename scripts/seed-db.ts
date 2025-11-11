import dbConnect from '../src/lib/db/mongodb';
import { User } from '../src/models/user';
import { Property } from '../src/models/property';
import { Review } from '../src/models/review';
import { Booking } from '../src/models/booking';
import { Favorite } from '../src/models/favorite';
import { Amenity } from '../src/models/amenity';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    console.log('🌱 Début du seeding de la base de données...');
    
    await dbConnect();

      // Nettoyer les collections existantes
  await User.deleteMany({});
  await Property.deleteMany({});
  await Review.deleteMany({});
  await Booking.deleteMany({});
  await Favorite.deleteMany({});
  await Amenity.deleteMany({});

    console.log('🗑️  Collections nettoyées');

    // Créer des utilisateurs de test
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        firstName: 'Admin',
        lastName: 'AtypikHouse',
        email: 'admin@atypikhouse.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      },
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: hashedPassword,
        role: 'owner',
        isVerified: true
      },
      {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true
      }
    ]);

    console.log('👥 Utilisateurs créés');

    // Créer des propriétés de test
    const properties = await Property.create([
      {
        title: 'Cabanes dans les arbres - Forêt de Fontainebleau',
        description: 'Vivez une expérience unique en hauteur dans nos cabanes perchées au cœur de la forêt de Fontainebleau. Vue panoramique et terrasse privée incluses.',
        type: 'cabin',
        location: {
          address: 'Route de la Forêt',
          city: 'Fontainebleau',
          country: 'France',
          coordinates: { lat: 48.4095, lng: 2.7014 }
        },
        price: {
          perNight: 120,
          currency: 'EUR'
        },
        capacity: {
          guests: 4,
          bedrooms: 2,
          bathrooms: 1
        },
        amenities: ['Vue panoramique', 'Terrasse privée', 'Chauffage', 'WiFi'],
        images: ['/images/cabin-1.jpg', '/images/cabin-2.jpg'],
        owner: users[1]._id,
        isAvailable: true,
        rating: 4.8
      },
      {
        title: 'Yourte nomade - Alpes françaises',
        description: 'Découvrez le confort nomade dans cette yourte traditionnelle au cœur des Alpes. Poêle à bois et décoration traditionnelle.',
        type: 'yurt',
        location: {
          address: 'Chemin des Alpages',
          city: 'Chamonix',
          country: 'France',
          coordinates: { lat: 45.9237, lng: 6.8694 }
        },
        price: {
          perNight: 95,
          currency: 'EUR'
        },
        capacity: {
          guests: 6,
          bedrooms: 3,
          bathrooms: 1
        },
        amenities: ['Poêle à bois', 'Décoration traditionnelle', 'Vue montagne', 'Parking'],
        images: ['/images/yurt-1.jpg', '/images/yurt-2.jpg'],
        owner: users[1]._id,
        isAvailable: true,
        rating: 4.6
      },
      {
        title: 'Maison flottante - Lac d\'Annecy',
        description: 'Flottez sur l\'eau en toute sérénité dans cette habitation unique sur le lac d\'Annecy. Ponton privé et pêche possible.',
        type: 'floating',
        location: {
          address: 'Quai du Lac',
          city: 'Annecy',
          country: 'France',
          coordinates: { lat: 45.8992, lng: 6.1294 }
        },
        price: {
          perNight: 150,
          currency: 'EUR'
        },
        capacity: {
          guests: 8,
          bedrooms: 4,
          bathrooms: 2
        },
        amenities: ['Ponton privé', 'Pêche possible', 'Coucher de soleil', 'Cuisine équipée'],
        images: ['/images/floating-1.jpg', '/images/floating-2.jpg'],
        owner: users[1]._id,
        isAvailable: true,
        rating: 4.9
      }
    ]);

    console.log('🏠 Propriétés créées');

    // Créer des avis de test
    const reviews = await Review.create([
      {
        property: properties[0]._id,
        user: users[2]._id,
        rating: 5,
        comment: 'Expérience incroyable ! La cabane est magnifique et l\'emplacement parfait pour se ressourcer.'
      },
      {
        property: properties[1]._id,
        user: users[2]._id,
        rating: 4,
        comment: 'Très belle yourte, bien équipée. Le poêle à bois est un vrai plus pour les soirées fraîches.'
      },
      {
        property: properties[2]._id,
        user: users[2]._id,
        rating: 5,
        comment: 'Séjour magique sur l\'eau ! La maison flottante est spacieuse et la vue sur le lac est à couper le souffle.'
      }
    ]);

    console.log('⭐ Avis créés');

    // Créer des amenities
    const amenities = await Amenity.create([
      { name: 'Wi-Fi', icon: 'wifi', category: 'basic' },
      { name: 'Climatisation', icon: 'snowflake', category: 'comfort' },
      { name: 'Cuisine équipée', icon: 'utensils', category: 'basic' },
      { name: 'Parking', icon: 'car', category: 'basic' },
      { name: 'Piscine', icon: 'swimming-pool', category: 'luxury' },
      { name: 'Jardin', icon: 'tree', category: 'outdoor' },
      { name: 'Salle de sport', icon: 'dumbbell', category: 'luxury' },
      { name: 'Ascenseur', icon: 'elevator', category: 'accessibility' }
    ]);

    console.log('🏠 Amenities créées');

    // Créer des réservations
    const bookings = await Booking.create([
      {
        userId: users[2]._id,
        propertyId: properties[0]._id,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-05'),
        totalPrice: properties[0].price.perNight * 4,
        guests: 2,
        status: 'confirmed'
      },
      {
        userId: users[2]._id,
        propertyId: properties[1]._id,
        startDate: new Date('2024-12-10'),
        endDate: new Date('2024-12-15'),
        totalPrice: properties[1].price.perNight * 5,
        guests: 3,
        status: 'pending'
      }
    ]);

    console.log('📅 Réservations créées');

    // Créer des favoris
    const favorites = await Favorite.create([
      {
        userId: users[2]._id,
        propertyId: properties[0]._id
      },
      {
        userId: users[2]._id,
        propertyId: properties[1]._id
      }
    ]);

    console.log('❤️ Favoris créés');

    // Mettre à jour les propriétés avec les avis
    for (let i = 0; i < properties.length; i++) {
      await Property.findByIdAndUpdate(properties[i]._id, {
        $push: { reviews: reviews[i]._id }
      });
    }

    console.log('✅ Base de données peuplée avec succès !');
    console.log(`📊 Statistiques :`);
    console.log(`   - ${users.length} utilisateurs créés`);
    console.log(`   - ${properties.length} propriétés créées`);
    console.log(`   - ${reviews.length} avis créés`);
    console.log(`   - ${amenities.length} amenities créées`);
    console.log(`   - ${bookings.length} réservations créées`);
    console.log(`   - ${favorites.length} favoris créés`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding :', error);
    process.exit(1);
  }
}

seedDatabase();
