import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Booking } from '@/models/booking';
import { Property } from '@/models/property';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

// GET /api/bookings/[id] - Récupérer une réservation spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const booking = await Booking.findById(params.id)
      .populate('userId', 'firstName lastName email')
      .populate('propertyId', 'title location price images ownerId');

    if (!booking) {
      return NextResponse.json({ message: 'Réservation non trouvée' }, { status: 404 });
    }

    // Vérifier que l'utilisateur peut voir cette réservation
    const bookingUserId = booking.userId.toString();
    const propertyOwnerId = booking.propertyId.ownerId?.toString();
    
    if (bookingUserId !== token.userId && propertyOwnerId !== token.userId && token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de la réservation' },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id]/cancel - Annuler une réservation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const booking = await Booking.findById(params.id)
      .populate('propertyId', 'ownerId');

    if (!booking) {
      return NextResponse.json({ message: 'Réservation non trouvée' }, { status: 404 });
    }

    // Vérifier les permissions
    const bookingUserId = booking.userId.toString();
    const propertyOwnerId = booking.propertyId.ownerId?.toString();
    
    if (bookingUserId !== token.userId && propertyOwnerId !== token.userId && token.role !== 'admin') {
      return NextResponse.json({ message: 'Vous n\'avez pas la permission d\'annuler cette réservation' }, { status: 403 });
    }

    // Vérifier que la réservation peut être annulée
    const now = new Date();
    const startDate = new Date(booking.startDate);
    
    if (startDate <= now) {
      return NextResponse.json({ message: 'Impossible d\'annuler une réservation qui a déjà commencé' }, { status: 400 });
    }

    // Annuler la réservation
    booking.status = 'cancelled';
    await booking.save();

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'annulation de la réservation' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Supprimer une réservation (admin seulement)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const booking = await Booking.findByIdAndDelete(params.id);

    if (!booking) {
      return NextResponse.json({ message: 'Réservation non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la réservation' },
      { status: 500 }
    );
  }
}


