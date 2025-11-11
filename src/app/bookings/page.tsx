'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Euro, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Booking {
  _id: string;
  propertyId: {
    _id: string;
    title: string;
    location: {
      address: string;
      city: string;
    };
    price: {
      perNight: number;
      currency: string;
    };
    images: string[];
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guests: number;
  specialRequests?: string;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else if (response.status === 401) {
        toast({
          title: 'Non autorisé',
          description: 'Veuillez vous connecter pour voir vos réservations',
          variant: 'destructive',
        });
        router.push('/login');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des réservations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        toast({
          title: 'Réservation annulée',
          description: 'Votre réservation a été annulée avec succès.',
        });
        fetchBookings(); // Recharger les réservations
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible d\'annuler la réservation',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'confirmed':
        return <Badge variant="default">Confirmée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      case 'completed':
        return <Badge variant="outline">Terminée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Réservations</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos réservations et suivez leur statut
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune réservation
              </h3>
              <p className="text-gray-600 mb-4">
                Vous n'avez pas encore de réservations.
              </p>
              <Button onClick={() => router.push('/properties')}>
                Découvrir nos propriétés
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.propertyId.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        {booking.propertyId.location.address}, {booking.propertyId.location.city}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Arrivée</p>
                        <p className="text-sm text-gray-600">{formatDate(booking.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Départ</p>
                        <p className="text-sm text-gray-600">{formatDate(booking.endDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Voyageurs</p>
                        <p className="text-sm text-gray-600">{booking.guests}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-bold">{booking.totalPrice}€</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Réservé le {formatDate(booking.createdAt)}
                    </p>
                  </div>

                  {booking.specialRequests && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Demandes spéciales :
                      </p>
                      <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                    </div>
                  )}

                  {booking.propertyId.images.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={booking.propertyId.images[0]}
                        alt={booking.propertyId.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/properties/${booking.propertyId._id}`)}
                    >
                      Voir la propriété
                    </Button>
                    {booking.status === 'pending' && (
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
