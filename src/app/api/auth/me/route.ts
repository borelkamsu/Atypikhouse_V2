import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const user = await User.findById(token.userId)
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
