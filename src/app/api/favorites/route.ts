import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db/mongodb';
import { Favorite } from '@/models/favorite';
import { Property } from '@/models/property';
import { verifyToken } from '@/lib/auth/jwt';

// Schéma de validation pour ajouter un favori
const addFavoriteSchema = z.object({
  propertyId: z.string().min(1, 'ID de propriété requis')
});

// GET /api/favorites - Récupérer les favoris de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const favorites = await Favorite.find({ userId: token.userId })
      .populate({
        path: 'propertyId',
        select: 'title description location price images type capacity rating'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des favoris' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Ajouter une propriété aux favoris
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = addFavoriteSchema.parse(body);

    // Vérifier que la propriété existe
    const property = await Property.findById(validatedData.propertyId);
    if (!property) {
      return NextResponse.json({ message: 'Propriété non trouvée' }, { status: 404 });
    }

    // Vérifier si le favori existe déjà
    const existingFavorite = await Favorite.findOne({
      userId: token.userId,
      propertyId: validatedData.propertyId
    });

    if (existingFavorite) {
      return NextResponse.json({ message: 'Cette propriété est déjà dans vos favoris' }, { status: 400 });
    }

    // Créer le favori
    const favorite = new Favorite({
      userId: token.userId,
      propertyId: validatedData.propertyId
    });

    await favorite.save();

    // Populate les données pour la réponse
    await favorite.populate({
      path: 'propertyId',
      select: 'title description location price images type capacity rating'
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Données invalides', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de l\'ajout aux favoris:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'ajout aux favoris' },
      { status: 500 }
    );
  }
}
