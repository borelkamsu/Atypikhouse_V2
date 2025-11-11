import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';

export async function POST() {
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
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.isActive = true;
      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      
      return NextResponse.json({
        success: true,
        message: 'Admin account updated!',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
    }
    
    // Créer le compte admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
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
      success: true,
      message: 'Admin account created successfully!',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
