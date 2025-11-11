import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db/mongodb';
import { Amenity } from '@/models/amenity';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

// Schéma de validation pour créer une amenity
const createAmenitySchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  icon: z.string().optional(),
  category: z.enum(['basic', 'comfort', 'luxury', 'outdoor', 'safety', 'accessibility']).optional()
});

// GET /api/amenities - Récupérer toutes les amenities
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');

    let query: any = {};

    // Filtrer par catégorie si spécifié
    if (category) {
      query.category = category;
    }

    // Filtrer par statut actif si spécifié
    if (active !== null) {
      query.isActive = active === 'true';
    }

    const amenities = await Amenity.find(query)
      .sort({ name: 1 });

    return NextResponse.json(amenities);
  } catch (error) {
    console.error('Erreur lors de la récupération des amenities:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des amenities' },
      { status: 500 }
    );
  }
}

// POST /api/amenities - Créer une nouvelle amenity (admin seulement)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createAmenitySchema.parse(body);

    // Vérifier si l'amenity existe déjà
    const existingAmenity = await Amenity.findOne({ name: validatedData.name });
    if (existingAmenity) {
      return NextResponse.json({ message: 'Cette amenity existe déjà' }, { status: 400 });
    }

    // Créer l'amenity
    const amenity = new Amenity({
      name: validatedData.name,
      icon: validatedData.icon,
      category: validatedData.category || 'basic',
      isActive: true
    });

    await amenity.save();

    return NextResponse.json(amenity, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Données invalides', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création de l\'amenity:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de l\'amenity' },
      { status: 500 }
    );
  }
}


