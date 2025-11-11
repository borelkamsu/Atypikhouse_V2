import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';
import { Booking } from '@/models/booking';

export interface OwnerProperty {
  _id: string;
  title: string;
  type: string;
  location: {
    city: string;
    country: string;
  };
  price: {
    perNight: number;
    currency: string;
  };
  capacity: {
    guests: number;
  };
  images: Array<{ url: string; publicId: string }>;
  rating: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface OwnerBooking {
  _id: string;
  propertyId: {
    _id: string;
    title: string;
  };
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guests: number;
  createdAt: string;
}

export interface OwnerStats {
  totalProperties: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  averageRating: number;
}

export async function getOwnerProperties(ownerId: string): Promise<OwnerProperty[]> {
  await dbConnect();

  const properties = await Property.find({ owner: ownerId })
    .sort({ createdAt: -1 })
    .lean();

  return properties.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    type: p.type,
    location: p.location,
    price: p.price,
    capacity: p.capacity,
    images: p.images || [],
    rating: p.rating || 0,
    isAvailable: p.isAvailable,
    createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
  }));
}

export async function getOwnerBookings(ownerId: string): Promise<OwnerBooking[]> {
  await dbConnect();

  // Récupérer les propriétés du propriétaire
  const properties = await Property.find({ owner: ownerId }).select('_id').lean();
  const propertyIds = properties.map(p => p._id);

  // Récupérer les réservations pour ces propriétés
  const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
    .populate('propertyId', 'title')
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .lean();

  return bookings.map((b: any) => ({
    _id: b._id.toString(),
    propertyId: {
      _id: (b.propertyId as any)._id.toString(),
      title: (b.propertyId as any).title,
    },
    userId: {
      firstName: (b.userId as any).firstName,
      lastName: (b.userId as any).lastName,
      email: (b.userId as any).email,
    },
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    totalPrice: b.totalPrice,
    status: b.status,
    guests: b.guests,
    createdAt: b.createdAt?.toISOString() || new Date().toISOString(),
  }));
}

export async function calculateOwnerStats(
  properties: OwnerProperty[],
  bookings: OwnerBooking[]
): Promise<OwnerStats> {
  const totalProperties = properties.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const averageRating = properties.length > 0
    ? properties.reduce((sum, p) => sum + p.rating, 0) / properties.length
    : 0;

  return {
    totalProperties,
    totalBookings,
    pendingBookings,
    totalRevenue,
    averageRating,
  };
}
