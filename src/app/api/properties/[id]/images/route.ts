import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = verifyTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    if (token.role !== 'owner' && token.role !== 'admin') {
      return NextResponse.json({ message: 'Seuls les propriétaires peuvent uploader des images' }, { status: 403 });
    }

    const property = await Property.findById(params.id);
    if (!property) {
      return NextResponse.json({ message: 'Propriété non trouvée' }, { status: 404 });
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (property.owner.toString() !== token.userId && token.role !== 'admin') {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'Aucune image fournie' }, { status: 400 });
    }

    // Upload vers Cloudinary
    const uploadPromises = files.map(file => uploadImage(file));
    const imageObjects = await Promise.all(uploadPromises);

    // Ajouter les objets {url, publicId} aux images existantes
    property.images = [...property.images, ...imageObjects];
    await property.save();

    return NextResponse.json({
      message: 'Images uploadées avec succès',
      imageCount: imageObjects.length,
      property
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload des images:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'upload des images' },
      { status: 500 }
    );
  }
}
