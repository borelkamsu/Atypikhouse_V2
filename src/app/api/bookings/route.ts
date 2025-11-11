import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db/mongodb';
import { Booking } from '@/models/booking';
import { Property } from '@/models/property';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

// Schéma de validation pour créer une réservation
const createBookingSchema = z.object({
  propertyId: z.string().min(1, 'ID de propriété requis'),
  startDate: z.string().datetime('Date de début invalide'),
  endDate: z.string().datetime('Date de fin invalide'),
  guests: z.number().min(1, 'Au moins 1 invité requis').max(20, 'Maximum 20 invités'),
  specialRequests: z.string().optional()
});

// GET /api/bookings - Récupérer les réservations de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    let query: any = {};

    // Filtrer par statut si spécifié
    if (status) {
      query.status = status;
    }

    // Si admin, récupérer toutes les réservations
    if (role === 'admin') {
      const bookings = await Booking.find(query)
        .populate('userId', 'firstName lastName email')
        .populate('propertyId', 'title location price')
        .sort({ createdAt: -1 });
      
      return NextResponse.json(bookings);
    }

    // Sinon, récupérer seulement les réservations de l'utilisateur
    query.userId = token.userId;
    const bookings = await Booking.find(query)
      .populate('propertyId', 'title location price images')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Créer une nouvelle réservation
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Vérifier que la propriété existe
    const property = await Property.findById(validatedData.propertyId);
    if (!property) {
      return NextResponse.json({ message: 'Propriété non trouvée' }, { status: 404 });
    }

    // Vérifier que les dates sont valides
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);
    const now = new Date();

    if (startDate <= now) {
      return NextResponse.json({ message: 'La date de début doit être dans le futur' }, { status: 400 });
    }

    if (endDate <= startDate) {
      return NextResponse.json({ message: 'La date de fin doit être après la date de début' }, { status: 400 });
    }

    // Vérifier la disponibilité
    const conflictingBooking = await Booking.findOne({
      propertyId: validatedData.propertyId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startDate: { $lt: endDate },
          endDate: { $gt: startDate }
        }
      ]
    });

    if (conflictingBooking) {
      return NextResponse.json({ message: 'La propriété n\'est pas disponible pour ces dates' }, { status: 400 });
    }

    // Calculer le prix total
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price.perNight * days;

    // Créer la réservation
    const booking = new Booking({
      userId: token.userId,
      propertyId: validatedData.propertyId,
      startDate,
      endDate,
      totalPrice,
      guests: validatedData.guests,
      specialRequests: validatedData.specialRequests,
      status: 'pending'
    });

    await booking.save();

    // Populate les données pour la réponse
    await booking.populate('propertyId', 'title location price images');

    return NextResponse.json(
      {
        message: 'Réservation créée avec succès',
        booking
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Données invalides', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création de la réservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la réservation' },
      { status: 500 }
    );
  }
}


