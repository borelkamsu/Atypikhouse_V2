import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

// PUT /api/admin/owners/[id]/reject - Rejeter un propriétaire
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const ownerId = params.id;

    // Vérifier que le propriétaire existe
    const owner = await User.findById(ownerId);
    if (!owner) {
      return NextResponse.json({ message: 'Propriétaire non trouvé' }, { status: 404 });
    }

    if (owner.role !== 'owner') {
      return NextResponse.json({ message: 'Cet utilisateur n\'est pas un propriétaire' }, { status: 400 });
    }

    // Rejeter le propriétaire
    owner.hostStatus = 'rejected';
    owner.isActive = false;
    await owner.save();

    // Retourner le propriétaire mis à jour sans le mot de passe
    const updatedOwner = owner.toObject();
    delete updatedOwner.password;

    return NextResponse.json({
      message: 'Propriétaire rejeté avec succès',
      owner: updatedOwner
    });
  } catch (error) {
    console.error('Erreur lors du rejet du propriétaire:', error);
    return NextResponse.json(
      { message: 'Erreur lors du rejet du propriétaire' },
      { status: 500 }
    );
  }
}
