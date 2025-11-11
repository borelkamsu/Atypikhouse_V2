import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';
import { Booking } from '@/models/booking';

// GET /api/properties/featured - Récupérer les propriétés les plus réservées
// Query params: limit (1-50, default: 6) - nombre de propriétés à retourner
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '6');
    // Validation et sécurisation du paramètre limit
    const limit = (limitParam > 0 && limitParam <= 50) ? limitParam : 6;

    // Agréger les bookings par propriété pour trouver les plus réservées
    const mostBookedProperties = await Booking.aggregate([
      {
        $group: {
          _id: '$property',
          bookingCount: { $sum: 1 }
        }
      },
      {
        $sort: { bookingCount: -1 }
      },
      {
        $limit: limit
      }
    ]);

    // Extraire les IDs des propriétés
    const propertyIds = mostBookedProperties.map(item => item._id);

    // Si aucune propriété n'a de réservation, récupérer les plus récentes
    let properties;
    if (propertyIds.length === 0) {
      properties = await Property.find({ isAvailable: true })
        .populate('owner', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } else {
      // Récupérer les propriétés les plus réservées
      properties = await Property.find({ 
        _id: { $in: propertyIds },
        isAvailable: true 
      })
        .populate('owner', 'firstName lastName')
        .lean();

      // Trier par nombre de réservations
      const propertyMap = new Map(properties.map(p => [(p as any)._id.toString(), p]));
      properties = propertyIds
        .map(id => propertyMap.get(id.toString()))
        .filter(p => p !== undefined) as any[];
    }

    return NextResponse.json({ properties });

  } catch (error: any) {
    console.error('Erreur lors de la récupération des propriétés en vedette:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
