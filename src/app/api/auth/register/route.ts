import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { firstName, lastName, email, password, phone } = body;

    // Validation des données
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Créer le nouvel utilisateur
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'user'
    });

    await user.save();

    // Générer le token JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Créer la réponse
    const response = NextResponse.json(
      {
        message: 'Utilisateur créé avec succès',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    );

    // Définir le cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    });

    return response;

  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}


