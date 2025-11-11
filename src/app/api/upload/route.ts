import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = verifyTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    if (token.role !== 'owner' && token.role !== 'admin') {
      return NextResponse.json({ message: 'Seuls les propriétaires peuvent uploader des images' }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'Aucune image fournie' }, { status: 400 });
    }

    const uploadPromises = files.map(file => uploadImage(file));
    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({
      message: 'Images uploadées avec succès',
      urls: imageUrls
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload des images:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'upload des images' },
      { status: 500 }
    );
  }
}
