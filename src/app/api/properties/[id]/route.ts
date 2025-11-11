import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';
import { verifyToken } from '@/lib/auth/jwt';

// GET /api/properties/:id - Récupérer une propriété spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const property = await Property.findById(params.id)
      .populate('owner', 'firstName lastName email')
      .lean();

    if (!property) {
      return NextResponse.json(
        { message: 'Propriété non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la propriété:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/:id - Modifier une propriété
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, type, location, price, capacity, amenities, images, isAvailable } = body;

    // Vérifier que la propriété existe
    const existingProperty = await Property.findById(params.id);
    if (!existingProperty) {
      return NextResponse.json(
        { message: 'Propriété non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (existingProperty.owner.toString() !== token.userId && token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Vous n\'êtes pas autorisé à modifier cette propriété' },
        { status: 403 }
      );
    }

    // Mettre à jour la propriété
    const updatedProperty = await Property.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        type,
        location,
        price,
        capacity,
        amenities,
        images,
        isAvailable
      },
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName');

    return NextResponse.json({
      message: 'Propriété mise à jour avec succès',
      property: updatedProperty
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la propriété:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/:id - Supprimer une propriété
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = await verifyToken(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que la propriété existe
    const existingProperty = await Property.findById(params.id);
    if (!existingProperty) {
      return NextResponse.json(
        { message: 'Propriété non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (existingProperty.owner.toString() !== token.userId && token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Vous n\'êtes pas autorisé à supprimer cette propriété' },
        { status: 403 }
      );
    }

    await Property.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Propriété supprimée avec succès'
    });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la propriété:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
