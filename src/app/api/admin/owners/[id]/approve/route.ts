import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { verifyToken } from '@/lib/auth/jwt';

// PUT /api/admin/owners/[id]/approve - Approuver un propriétaire
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const token = await verifyToken(request);
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

    // Approuver le propriétaire
    owner.hostStatus = 'approved';
    owner.isActive = true;
    await owner.save();

    // Retourner le propriétaire mis à jour sans le mot de passe
    const updatedOwner = owner.toObject();
    delete updatedOwner.password;

    return NextResponse.json({
      message: 'Propriétaire approuvé avec succès',
      owner: updatedOwner
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation du propriétaire:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'approbation du propriétaire' },
      { status: 500 }
    );
  }
}
