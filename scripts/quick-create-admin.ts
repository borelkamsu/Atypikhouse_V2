import dbConnect from '../src/lib/db/mongodb';
import User from '../src/models/user';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    // Connecter à MongoDB
    await dbConnect();
    console.log('✅ Connected to MongoDB');
    console.log('🔄 Creating admin account...');
    
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
      console.log('⚠️  Admin account already exists, updating...');
      
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Mettre à jour
      existingAdmin.password = hashedPassword;
      existingAdmin.isActive = true;
      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      
      console.log('✅ Admin account updated!');
      console.log('==============================================');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log(`👤 Role: ${existingAdmin.role}`);
      console.log('==============================================');
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
    console.log('⚠️  IMPORTANT: Change password after first login!');
    console.log('🔗 Login at: /login');
    console.log('==============================================');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
