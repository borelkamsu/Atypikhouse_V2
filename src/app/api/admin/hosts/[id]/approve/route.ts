import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

// POST /api/admin/hosts/[id]/approve - Approuver un hôte
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const host = await User.findByIdAndUpdate(
      params.id,
      { 
        hostStatus: 'approved',
        isActive: true
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!host) {
      return NextResponse.json({ message: 'Hôte non trouvé' }, { status: 404 });
    }

    if (host.role !== 'owner') {
      return NextResponse.json({ message: 'Cet utilisateur n\'est pas un hôte' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Hôte approuvé avec succès',
      host
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation de l\'hôte:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'approbation de l\'hôte' },
      { status: 500 }
    );
  }
}


