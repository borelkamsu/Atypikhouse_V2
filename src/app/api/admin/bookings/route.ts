import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Booking } from '@/models/booking';
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
    const status = searchParams.get('status');

    let query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'firstName lastName email')
      .populate('property', 'title location.city')
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

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId) {
      return NextResponse.json({ message: 'ID de réservation requis' }, { status: 400 });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    )
      .populate('user', 'firstName lastName email')
      .populate('property', 'title location.city');

    if (!booking) {
      return NextResponse.json({ message: 'Réservation non trouvée' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    );
  }
}
