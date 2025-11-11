import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';
import { Booking } from '@/models/booking';

// GET /api/properties/featured - Récupérer les derniers logements réservés
// Query params: limit (1-50, default: 3) - nombre de propriétés à retourner
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '3');
    // Validation et sécurisation du paramètre limit
    const limit = (limitParam > 0 && limitParam <= 50) ? limitParam : 3;

    // Récupérer les dernières réservations (triées par date de création décroissante)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(limit * 3) // Prendre plus de bookings pour assurer d'avoir assez de propriétés uniques
      .select('propertyId')
      .lean();

    // Extraire les IDs de propriétés uniques (éviter les doublons)
    const uniquePropertyIds = [...new Set(
      recentBookings.map(booking => (booking as any).propertyId.toString())
    )].slice(0, limit); // Limiter au nombre demandé

    // Si aucune réservation n'existe, récupérer les propriétés les plus récentes
    let properties;
    if (uniquePropertyIds.length === 0) {
      properties = await Property.find({ isAvailable: true })
        .populate('owner', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } else {
      // Récupérer les propriétés récemment réservées (uniquement celles disponibles)
      properties = await Property.find({ 
        _id: { $in: uniquePropertyIds },
        isAvailable: true
      })
        .populate('owner', 'firstName lastName')
        .lean();

      // Maintenir l'ordre des propriétés (du plus récemment réservé au moins récent)
      const propertyMap = new Map(properties.map(p => [(p as any)._id.toString(), p]));
      properties = uniquePropertyIds
        .map(id => propertyMap.get(id))
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
