import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { Property } from '@/models/property';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

// GET /api/admin/owners - Récupérer tous les propriétaires avec statistiques
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
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

    // Récupérer les IDs des propriétaires
    const ownerIds = owners.map(owner => owner._id);

    // Compter les propriétés pour tous les propriétaires en une seule agrégation (évite N+1)
    const propertyCounts = await Property.aggregate([
      {
        $match: { owner: { $in: ownerIds } }
      },
      {
        $group: {
          _id: '$owner',
          count: { $sum: 1 }
        }
      }
    ]);

    // Créer un Map pour un accès rapide aux counts
    const propertyCountMap = new Map(
      propertyCounts.map(item => [item._id.toString(), item.count])
    );

    // Ajouter le count à chaque propriétaire
    const ownersWithStats = owners.map(owner => ({
      ...owner.toObject(),
      propertyCount: propertyCountMap.get(owner._id.toString()) || 0
    }));

    return NextResponse.json(ownersWithStats);
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétaires:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des propriétaires' },
      { status: 500 }
    );
  }
}
