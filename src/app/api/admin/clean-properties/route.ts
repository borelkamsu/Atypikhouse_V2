import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const token = verifyTokenFromRequest(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès admin requis' }, { status: 403 });
    }

    const result = await Property.deleteMany({});

    return NextResponse.json({
      message: 'Propriétés supprimées avec succès',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Erreur lors de la suppression des propriétés:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
