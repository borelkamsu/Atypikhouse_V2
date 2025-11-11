import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';
import { User } from '@/models/user';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status === 'available') {
      query.isAvailable = true;
    } else if (status === 'unavailable') {
      query.isAvailable = false;
    }

    const properties = await Property.find(query)
      .populate('owner', 'firstName lastName email companyName')
      .sort({ createdAt: -1 });

    // Filtrer les propriétés avec owner null et fournir un objet de repli pour les orphelines
    const propertiesWithOwner = properties.map(property => {
      const propertyObj = property.toObject();
      
      // Si le propriétaire n'existe pas (supprimé), fournir un objet de repli
      if (!propertyObj.owner) {
        propertyObj.owner = {
          _id: 'unknown',
          firstName: 'Propriétaire',
          lastName: 'inconnu',
          email: 'N/A',
          companyName: null
        };
      }
      
      return propertyObj;
    });

    return NextResponse.json(propertiesWithOwner);
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des propriétés' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const body = await request.json();
    const { propertyId, isAvailable } = body;

    if (!propertyId) {
      return NextResponse.json({ message: 'ID de propriété requis' }, { status: 400 });
    }

    const property = await Property.findByIdAndUpdate(
      propertyId,
      { isAvailable },
      { new: true }
    ).populate('owner', 'firstName lastName email companyName');

    if (!property) {
      return NextResponse.json({ message: 'Propriété non trouvée' }, { status: 404 });
    }

    // Gérer le cas où le propriétaire n'existe pas
    const propertyObj = property.toObject();
    if (!propertyObj.owner) {
      propertyObj.owner = {
        _id: 'unknown',
        firstName: 'Propriétaire',
        lastName: 'inconnu',
        email: 'N/A',
        companyName: null
      };
    }

    return NextResponse.json(propertyObj);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la propriété:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la propriété' },
      { status: 500 }
    );
  }
}
