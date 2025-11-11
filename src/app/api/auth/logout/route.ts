import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Créer une réponse de succès
    const response = NextResponse.json(
      { message: 'Déconnexion réussie' },
      { status: 200 }
    );

    // Supprimer le cookie de token
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immédiatement
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}
