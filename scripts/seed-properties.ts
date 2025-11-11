import mongoose from 'mongoose';
import { Property } from '../src/models/property';
import { User } from '../src/models/user';

// Connexion à MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/atypikhouse';

async function seedProperties() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer un propriétaire de test
    const owner = new User({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'owner@test.com',
      password: '$2b$10$example', // Mot de passe hashé
      phone: '0123456789',
      role: 'owner',
      isActive: true,
      isVerified: true,
      hostStatus: 'approved',
      siret: '12345678901234',
      companyName: 'Cabane & Co',
      businessDescription: 'Spécialiste des cabanes insolites'
    });

    await owner.save();
    console.log('✅ Propriétaire créé');

    // Données des propriétés de test
    const propertiesData = [
      {
        title: 'Cabane dans les arbres - Vue panoramique',
        description: 'Une magnifique cabane perchée dans les arbres avec une vue exceptionnelle sur la vallée. Idéale pour un séjour romantique ou une escapade nature.',
        type: 'cabin',
        location: {
          address: '123 Route de la Forêt',
          city: 'Chamonix',
          country: 'France',
          coordinates: {
            lat: 45.9237,
            lng: 6.8694
          }
        },
        price: {
          perNight: 120,
          currency: 'EUR'
        },
        capacity: {
          guests: 2,
          bedrooms: 1,
          bathrooms: 1
        },
        amenities: ['WiFi', 'Parking', 'Chauffage', 'Cheminée', 'Vue panoramique'],
        images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'],
        rating: 4.8,
        isAvailable: true,
        owner: owner._id
      },
      {
        title: 'Yourte traditionnelle mongole',
        description: 'Découvrez l\'authenticité d\'une yourte traditionnelle mongole dans un cadre naturel préservé. Une expérience unique en son genre.',
        type: 'yurt',
        location: {
          address: '456 Chemin des Nomades',
          city: 'Annecy',
          country: 'France',
          coordinates: {
            lat: 45.8992,
            lng: 6.1294
          }
        },
        price: {
          perNight: 95,
          currency: 'EUR'
        },
        capacity: {
          guests: 4,
          bedrooms: 2,
          bathrooms: 1
        },
        amenities: ['Parking', 'Jardin', 'Terrasse', 'Non-fumeur'],
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'],
        rating: 4.6,
        isAvailable: true,
        owner: owner._id
      },
      {
        title: 'Maison flottante - Lac de Serre-Ponçon',
        description: 'Profitez d\'un séjour unique sur une maison flottante au cœur du lac de Serre-Ponçon. Vue imprenable et tranquillité garantie.',
        type: 'floating',
        location: {
          address: '789 Port de Plaisance',
          city: 'Embrun',
          country: 'France',
          coordinates: {
            lat: 44.5636,
            lng: 6.4953
          }
        },
        price: {
          perNight: 180,
          currency: 'EUR'
        },
        capacity: {
          guests: 6,
          bedrooms: 3,
          bathrooms: 2
        },
        amenities: ['WiFi', 'Parking', 'Cuisine équipée', 'Piscine', 'Terrasse', 'Lave-linge'],
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
        rating: 4.9,
        isAvailable: true,
        owner: owner._id
      },
      {
        title: 'Dôme géodésique - Observatoire des étoiles',
        description: 'Un dôme géodésique transparent pour observer les étoiles dans un cadre naturel exceptionnel. Équipé d\'un télescope professionnel.',
        type: 'dome',
        location: {
          address: '321 Plateau de l\'Observatoire',
          city: 'Gap',
          country: 'France',
          coordinates: {
            lat: 44.5596,
            lng: 6.0794
          }
        },
        price: {
          perNight: 150,
          currency: 'EUR'
        },
        capacity: {
          guests: 2,
          bedrooms: 1,
          bathrooms: 1
        },
        amenities: ['WiFi', 'Parking', 'Chauffage', 'Télescope', 'Vue étoiles'],
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
        rating: 4.7,
        isAvailable: true,
        owner: owner._id
      }
    ];

    // Créer les propriétés
    for (const propertyData of propertiesData) {
      const property = new Property(propertyData);
      await property.save();
      console.log(`✅ Propriété créée: ${property.title}`);
    }

    console.log('🎉 Toutes les propriétés de test ont été créées avec succès !');
    console.log(`👤 Propriétaire: ${owner.email}`);
    console.log(`🏠 Nombre de propriétés: ${propertiesData.length}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
seedProperties();
