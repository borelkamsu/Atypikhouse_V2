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
      .populate('userId', 'firstName lastName email')
      .populate('propertyId', 'title location')
      .sort({ createdAt: -1 });

    // Gérer les relations orphelines (user ou property supprimés)
    const bookingsWithDefaults = bookings.map(booking => {
      const bookingObj = booking.toObject();
      
      // Fournir un objet de repli si l'utilisateur n'existe pas
      if (!bookingObj.userId) {
        bookingObj.userId = {
          _id: 'unknown',
          firstName: 'Utilisateur',
          lastName: 'supprimé',
          email: 'N/A'
        };
      }
      
      // Fournir un objet de repli si la propriété n'existe pas
      if (!bookingObj.propertyId) {
        bookingObj.propertyId = {
          _id: 'unknown',
          title: 'Propriété supprimée',
          location: {
            city: 'N/A',
            country: 'N/A',
            address: 'N/A'
          }
        };
      }
      
      return bookingObj;
    });

    return NextResponse.json(bookingsWithDefaults);
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
      .populate('userId', 'firstName lastName email')
      .populate('propertyId', 'title location');

    if (!booking) {
      return NextResponse.json({ message: 'Réservation non trouvée' }, { status: 404 });
    }

    // Gérer les relations orphelines
    const bookingObj = booking.toObject();
    
    if (!bookingObj.userId) {
      bookingObj.userId = {
        _id: 'unknown',
        firstName: 'Utilisateur',
        lastName: 'supprimé',
        email: 'N/A'
      };
    }
    
    if (!bookingObj.propertyId) {
      bookingObj.propertyId = {
        _id: 'unknown',
        title: 'Propriété supprimée',
        location: {
          city: 'N/A',
          country: 'N/A',
          address: 'N/A'
        }
      };
    }

    return NextResponse.json(bookingObj);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    );
  }
}
