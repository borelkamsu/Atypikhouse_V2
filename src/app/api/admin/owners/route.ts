import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { Property } from '@/models/property';
import { verifyToken } from '@/lib/auth/jwt';

// GET /api/admin/owners - Récupérer tous les propriétaires avec statistiques
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = await verifyToken(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query: any = { role: 'owner' };

    // Recherche par nom, prénom, email ou nom d'entreprise
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtrer par statut d'hôte
    if (status && status !== 'all') {
      query.hostStatus = status;
    }

    const owners = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Pour chaque propriétaire, compter le nombre de propriétés
    const ownersWithStats = await Promise.all(
      owners.map(async (owner) => {
        const propertyCount = await Property.countDocuments({ owner: owner._id });
        return {
          ...owner.toObject(),
          propertyCount
        };
      })
    );

    return NextResponse.json(ownersWithStats);
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétaires:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des propriétaires' },
      { status: 500 }
    );
  }
}
