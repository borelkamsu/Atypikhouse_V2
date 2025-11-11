import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Favorite } from '@/models/favorite';
import { verifyToken } from '@/lib/auth/jwt';

// DELETE /api/favorites/[propertyId] - Supprimer un favori
export async function DELETE(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    await dbConnect();
    
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const favorite = await Favorite.findOneAndDelete({
      userId: token.userId,
      propertyId: params.propertyId
    });

    if (!favorite) {
      return NextResponse.json({ message: 'Favori non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favori supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du favori:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du favori' },
      { status: 500 }
    );
  }
}

// GET /api/favorites/[propertyId]/check - Vérifier si une propriété est en favori
export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    await dbConnect();
    
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const favorite = await Favorite.findOne({
      userId: token.userId,
      propertyId: params.propertyId
    });

    return NextResponse.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Erreur lors de la vérification du favori:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la vérification du favori' },
      { status: 500 }
    );
  }
}


