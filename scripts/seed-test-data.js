const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Modèles (simplifiés pour le seed)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['client', 'owner', 'admin'], default: 'client' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
});

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  maxGuests: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [String],
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true },
  instantBooking: { type: Boolean, default: false }
});

const amenitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, default: 'general' }
});

const User = mongoose.model('User', userSchema);
const Property = mongoose.model('Property', propertySchema);
const Amenity = mongoose.model('Amenity', amenitySchema);

async function seedDatabase() {
  try {
    // Connexion à MongoDB
    await mongoose.connect('mongodb://mongodb:27017/atypikhouse', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('🔌 Connecté à MongoDB');
    
    // Nettoyer la base de données
    await User.deleteMany({});
    await Property.deleteMany({});
    await Amenity.deleteMany({});
    
    console.log('🧹 Base de données nettoyée');
    
    // Créer un utilisateur admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@atypikhouse.fr',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'AtypikHouse',
      phone: '+33123456789',
      role: 'admin',
      isVerified: true
    });
    
    // Créer un propriétaire
    const ownerPassword = await bcrypt.hash('owner123', 10);
    const owner = await User.create({
      email: 'owner@atypikhouse.fr',
      password: ownerPassword,
      firstName: 'Pierre',
      lastName: 'Dupont',
      phone: '+33987654321',
      role: 'owner',
      isVerified: true
    });
    
    // Créer un client
    const clientPassword = await bcrypt.hash('client123', 10);
    const client = await User.create({
      email: 'client@atypikhouse.fr',
      password: clientPassword,
      firstName: 'Marie',
      lastName: 'Martin',
      phone: '+33555666777',
      role: 'client',
      isVerified: true
    });
    
    console.log('👥 Utilisateurs créés');
    
    // Créer des équipements
    const amenities = [
      'WiFi', 'Parking gratuit', 'Cuisine équipée', 'Chauffage', 'Climatisation',
      'Piscine', 'Jardin', 'Balcon', 'Terrasse', 'BBQ', 'Lave-linge', 'Sèche-linge',
      'Télévision', 'Lave-vaisselle', 'Micro-ondes', 'Réfrigérateur', 'Cafetière',
      'Fer à repasser', 'Sèche-cheveux', 'Serviettes', 'Draps', 'Produits de toilette'
    ];
    
    for (const amenity of amenities) {
      await Amenity.create({ name: amenity });
    }
    
    console.log('🏠 Équipements créés');
    
    // Créer des propriétés
    const properties = [
      {
        name: 'Cabane perchée dans les cèdres',
        description: 'Vivez une expérience unique en hauteur dans cette magnifique cabane perchée au cœur de la forêt. Idéale pour un séjour romantique ou en famille.',
        type: 'cabin',
        price: 120,
        location: 'Forêt de Brocéliande, France',
        address: '123 Route de la forêt, 35130 Paimpont',
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['WiFi', 'Parking gratuit', 'Cuisine équipée', 'Chauffage', 'Jardin'],
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
        owner: owner._id,
        instantBooking: true
      },
      {
        name: 'Yourte traditionnelle mongole',
        description: 'Découvrez le confort nomade dans cette yourte authentique. Un retour aux sources au cœur de la nature.',
        type: 'yurt',
        price: 95,
        location: 'Montagne Noire, France',
        address: '456 Chemin des étoiles, 11160 Caunes-Minervois',
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 1,
        amenities: ['WiFi', 'Parking gratuit', 'Chauffage', 'Jardin', 'BBQ'],
        images: ['https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
        owner: owner._id,
        instantBooking: false
      },
      {
        name: 'Dôme transparent sous les étoiles',
        description: 'Observez les étoiles depuis votre lit dans ce dôme transparent unique. Une expérience magique sous la voûte céleste.',
        type: 'dome',
        price: 150,
        location: 'Cévennes, France',
        address: '789 Route des étoiles, 48400 Florac',
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['WiFi', 'Parking gratuit', 'Chauffage', 'Terrasse', 'Télévision'],
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
        owner: owner._id,
        instantBooking: true
      },
      {
        name: 'Cabane flottante sur le lac',
        description: 'Détendez-vous au fil de l\'eau dans cette cabane flottante. Le calme et la sérénité vous attendent.',
        type: 'floating',
        price: 110,
        location: 'Lac d\'Annecy, France',
        address: '321 Quai des flottants, 74000 Annecy',
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ['WiFi', 'Parking gratuit', 'Cuisine équipée', 'Balcon', 'BBQ'],
        images: ['https://images.unsplash.com/photo-1470010762743-1fa2363f65ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
        owner: owner._id,
        instantBooking: false
      }
    ];
    
    for (const propertyData of properties) {
      await Property.create(propertyData);
    }
    
    console.log('🏡 Propriétés créées');
    
    console.log('\n✅ Base de données initialisée avec succès !');
    console.log('\n📋 Comptes de test créés :');
    console.log('   Admin: admin@atypikhouse.fr / admin123');
    console.log('   Propriétaire: owner@atypikhouse.fr / owner123');
    console.log('   Client: client@atypikhouse.fr / client123');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

seedDatabase();
