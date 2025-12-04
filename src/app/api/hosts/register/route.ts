import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';

// Schéma de validation pour l'inscription d'un hôte
const hostRegistrationSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  siret: z.string()
    .min(14, 'Le SIRET doit contenir 14 chiffres')
    .max(14, 'Le SIRET doit contenir 14 chiffres')
    .regex(/^\d{14}$/, 'Le SIRET doit contenir uniquement 14 chiffres'),
  companyName: z.string().min(2, 'Nom de l\'entreprise requis'),
  businessDescription: z.string().optional()
});

// POST /api/hosts/register - Inscription directe d'un hôte
export async function POST(request: NextRequest) {
  try {
    // Vérifier les variables d'environnement critiques
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI est manquante');
      return NextResponse.json(
        { message: 'Configuration serveur invalide' },
        { status: 500 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    
    // Nettoyer le SIRET (retirer espaces et tirets)
    if (body.siret) {
      body.siret = body.siret.replace(/[\s-]/g, '');
    }
    
    // Log les données reçues (sans le mot de passe pour sécurité)
    console.log('📥 Données reçues pour inscription hôte:', {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      siret: body.siret ? `${body.siret.substring(0, 4)}...` : 'manquant',
      companyName: body.companyName,
      hasPassword: !!body.password,
      hasBusinessDescription: !!body.businessDescription
    });
    
    const validatedData = hostRegistrationSchema.parse(body);

    // Vérifier si l'email est déjà utilisé
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      if (existingUser.role === 'owner' || existingUser.role === 'admin') {
        return NextResponse.json({ message: 'Cet email est déjà utilisé' }, { status: 400 });
      }

      existingUser.firstName = validatedData.firstName;
      existingUser.lastName = validatedData.lastName;
      existingUser.password = validatedData.password;
      existingUser.phone = validatedData.phone;
      existingUser.role = 'owner';
      existingUser.siret = validatedData.siret;
      existingUser.companyName = validatedData.companyName;
      existingUser.businessDescription = validatedData.businessDescription;
      existingUser.hostStatus = 'pending';
      existingUser.isVerified = false;
      existingUser.isActive = true;

      await existingUser.save();

      const updatedUser = existingUser.toObject();
      delete updatedUser.password;

      return NextResponse.json({
        message: 'Votre demande d\'inscription propriétaire est en cours de validation',
        user: updatedUser
      }, { status: 200 });
    }

    // Créer le nouvel utilisateur avec le rôle propriétaire
    const newUser = new User({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: validatedData.password,
      phone: validatedData.phone,
      role: 'owner',
      siret: validatedData.siret,
      companyName: validatedData.companyName,
      businessDescription: validatedData.businessDescription,
      hostStatus: 'pending',
      isVerified: false,
      isActive: true
    });

    await newUser.save();

    // Retourner l'utilisateur sans le mot de passe
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json({
      message: 'Inscription en tant que propriétaire réussie',
      user: userResponse
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erreur de validation Zod:', error.errors);
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: error.errors,
          details: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
        },
        { status: 400 }
      );
    }

    console.error('❌ Erreur lors de l\'inscription d\'un hôte:', error);
    console.error('Stack trace:', error?.stack);
    console.error('Error message:', error?.message);
    console.error('Error name:', error?.name);
    
    // Log environment variables status (without values)
    console.error('Environment check:', {
      hasMongodbUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    });

    // Log de l'erreur MongoDB si présente
    if (error?.name === 'MongoServerError' || error?.message?.includes('MongoDB')) {
      console.error('❌ Erreur MongoDB détectée:', {
        code: error?.code,
        codeName: error?.codeName,
        message: error?.message
      });
    }

    // Return more details in development, generic message in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { 
        message: 'Erreur lors de l\'inscription d\'un hôte',
        ...(isDevelopment && {
          details: error?.message,
          stack: error?.stack,
          errorName: error?.name
        })
      },
      { status: 500 }
    );
  }
}