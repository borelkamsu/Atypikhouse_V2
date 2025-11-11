import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe sont requis' },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Générer le token JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Créer la réponse
    const response = NextResponse.json(
      {
        message: 'Connexion réussie',
        token: token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
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
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}


