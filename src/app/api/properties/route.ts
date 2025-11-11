import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Construire le filtre
    const filter: any = { isAvailable: true };

    if (type) {
      filter.type = type;
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter['price.perNight'] = {};
      if (minPrice) filter['price.perNight'].$gte = parseInt(minPrice);
      if (maxPrice) filter['price.perNight'].$lte = parseInt(maxPrice);
    }

    // Calculer le skip pour la pagination
    const skip = (page - 1) * limit;

    // Récupérer les propriétés avec pagination
    const properties = await Property.find(filter)
      .populate('owner', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Compter le total pour la pagination
    const total = await Property.countDocuments(filter);

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { title, description, type, location, price, capacity, amenities, images } = body;

    // Validation des données
    if (!title || !description || !type || !location || !price || !capacity || !images) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur connecté depuis le token
    const token = verifyTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que l'utilisateur est un propriétaire ou admin
    if (token.role !== 'owner' && token.role !== 'admin') {
      return NextResponse.json({ message: 'Seuls les propriétaires peuvent créer des propriétés' }, { status: 403 });
    }

    const ownerId = token.userId;

    // Créer la nouvelle propriété
    const property = new Property({
      title,
      description,
      type,
      location,
      price,
      capacity,
      amenities: amenities || [],
      images,
      owner: ownerId
    });

    await property.save();

    return NextResponse.json(
      {
        message: 'Propriété créée avec succès',
        property
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Erreur lors de la création de la propriété:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}


