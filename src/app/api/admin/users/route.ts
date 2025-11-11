import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { verifyToken } from '@/lib/auth/jwt';

// Schéma de validation pour mettre à jour un utilisateur
const updateUserSchema = z.object({
  role: z.enum(['user', 'owner', 'admin']).optional(),
  isActive: z.boolean().optional(),
  hostStatus: z.enum(['pending', 'approved', 'rejected']).optional()
});

// GET /api/admin/users - Récupérer tous les utilisateurs (admin seulement)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = await verifyToken(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    let query: any = {};

    // Recherche par nom, prénom ou email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtrer par rôle
    if (role) {
      query.role = role;
    }

    // Filtrer par statut
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}


