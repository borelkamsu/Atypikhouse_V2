import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { verifyToken } from '@/lib/auth/jwt';

// GET /api/admin/hosts - Récupérer tous les hôtes (admin seulement)
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
    if (status) {
      query.hostStatus = status;
    }

    const hosts = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json(hosts);
  } catch (error) {
    console.error('Erreur lors de la récupération des hôtes:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des hôtes' },
      { status: 500 }
    );
  }
}


