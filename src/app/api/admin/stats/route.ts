import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { User } from '@/models/user';
import { Property } from '@/models/property';
import { Booking } from '@/models/booking';
import { verifyTokenFromRequest } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const token = verifyTokenFromRequest(request);
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ message: 'Accès administrateur requis' }, { status: 403 });
    }

    const [
      totalUsers,
      totalProperties,
      totalBookings,
      pendingOwners,
      activeProperties,
      inactiveProperties,
      confirmedBookings,
      pendingBookings
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Property.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ role: 'owner', hostStatus: 'pending' }),
      Property.countDocuments({ isAvailable: true }),
      Property.countDocuments({ isAvailable: false }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'pending' })
    ]);

    return NextResponse.json({
      totalUsers,
      totalProperties,
      totalBookings,
      pendingOwners,
      activeProperties,
      inactiveProperties,
      confirmedBookings,
      pendingBookings
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
