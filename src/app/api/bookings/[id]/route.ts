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
    const propertyOwnerId = booking.propertyId?.ownerId?.toString();
    
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

// PATCH /api/bookings/[id] - Mettre à jour le statut d'une réservation
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

    const body = await request.json();
    const { status } = body;

    if (!status || !['confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ message: 'Statut invalide' }, { status: 400 });
    }

    const booking = await Booking.findById(params.id)
      .populate('propertyId', 'ownerId');

    if (!booking) {
      return NextResponse.json({ message: 'Réservation non trouvée' }, { status: 404 });
    }

    // Vérifier les permissions
    const bookingUserId = booking.userId.toString();
    const propertyOwnerId = booking.propertyId?.ownerId?.toString();
    const isOwner = propertyOwnerId === token.userId;
    const isClient = bookingUserId === token.userId;
    const isAdmin = token.role === 'admin';
    
    if (!isOwner && !isClient && !isAdmin) {
      return NextResponse.json({ message: 'Vous n\'avez pas la permission de modifier cette réservation' }, { status: 403 });
    }

    // Règles de validation selon le statut demandé
    if (status === 'confirmed') {
      // Seul le propriétaire ou l'admin peut confirmer
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ message: 'Seul le propriétaire peut confirmer une réservation' }, { status: 403 });
      }
      // On peut seulement confirmer une réservation en attente
      if (booking.status !== 'pending') {
        return NextResponse.json({ message: 'Seules les réservations en attente peuvent être confirmées' }, { status: 400 });
      }
    }

    if (status === 'cancelled') {
      // Le client, le propriétaire ou l'admin peuvent annuler
      // Vérifier que la réservation n'a pas déjà commencé
      const now = new Date();
      const startDate = new Date(booking.startDate);
      
      if (startDate <= now && !isAdmin) {
        return NextResponse.json({ message: 'Impossible d\'annuler une réservation qui a déjà commencé' }, { status: 400 });
      }
    }

    if (status === 'completed') {
      // Seul le propriétaire ou l'admin peut marquer comme terminée
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ message: 'Seul le propriétaire peut marquer une réservation comme terminée' }, { status: 403 });
      }
    }

    // Mettre à jour le statut
    booking.status = status;
    await booking.save();

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la réservation' },
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

