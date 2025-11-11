import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Schéma utilisateur simplifié pour le script
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  avatar: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  siret: String,
  companyName: String,
  businessDescription: String,
  businessDocuments: [String],
  hostStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Connexion directe à MongoDB
    await mongoose.connect('mongodb://localhost:27017/atypikhouse');
    console.log('✅ Connected to MongoDB');
    
    const adminEmail = 'admin@atypikhouse.com';
    const adminPassword = 'Admin123!';
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminEmail },
        { role: 'admin' }
      ]
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists, updating password...');
      
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Mettre à jour le mot de passe de l'admin existant
      existingAdmin.password = hashedPassword;
      existingAdmin.isActive = true;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      
      console.log('✅ Admin account updated successfully:');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Role: ${existingAdmin.role}`);
      console.log(`🔑 Password: ${adminPassword}`);
      process.exit(0);
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Créer le compte admin
    const admin = new User({
      firstName: 'Admin',
      lastName: 'System',
      email: adminEmail,
      password: hashedPassword,
      phone: '0000000000',
      role: 'admin',
      isActive: true,
      isVerified: true,
      hostStatus: 'approved'
    });
    
    await admin.save();
    
    console.log('🎉 Admin account created successfully!');
    console.log('==============================================');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👤 Role: admin`);
    console.log('==============================================');
    console.log('⚠️  IMPORTANT: Please change the default password after first login!');
    console.log('🔗 Access admin panel at: http://localhost:3000/admin/dashboard');
    console.log('==============================================');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
  
  process.exit(0);
}

createAdmin();
