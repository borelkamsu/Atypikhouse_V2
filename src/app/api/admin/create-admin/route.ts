import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import bcrypt from 'bcrypt';

// POST /api/admin/create-admin - Créer un compte admin (route spéciale)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
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
      // Mettre à jour le mot de passe de l'admin existant
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.isActive = true;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      
      return NextResponse.json({
        message: 'Admin account updated successfully',
        admin: {
          email: existingAdmin.email,
          role: existingAdmin.role,
          password: adminPassword
        }
      });
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
    
    return NextResponse.json({
      message: 'Admin account created successfully',
      admin: {
        email: adminEmail,
        role: 'admin',
        password: adminPassword
      }
    });
    
  } catch (error) {
    console.error('Error creating admin account:', error);
    return NextResponse.json(
      { message: 'Error creating admin account' },
      { status: 500 }
    );
  }
}
