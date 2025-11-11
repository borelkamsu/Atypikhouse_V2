'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Home, 
  Calendar, 
  Euro, 
  Users, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Building
} from 'lucide-react';

interface Property {
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
  images: string[];
  rating: number;
  isAvailable: boolean;
  createdAt: string;
}

interface Booking {
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

interface OwnerStats {
  totalProperties: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  averageRating: number;
}

export default function OwnerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<OwnerStats>({
    totalProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Récupérer les propriétés du propriétaire
      const propertiesResponse = await fetch('/api/properties?owner=true');
      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);
      }

      // Récupérer les réservations
      const bookingsResponse = await fetch('/api/bookings?owner=true');
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }

      // Calculer les statistiques
      calculateStats(propertiesData || [], bookingsData || []);

    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement du tableau de bord',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (propertiesData: Property[], bookingsData: Booking[]) => {
    const totalProperties = propertiesData.length;
    const totalBookings = bookingsData.length;
    const pendingBookings = bookingsData.filter(b => b.status === 'pending').length;
    const totalRevenue = bookingsData
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.totalPrice, 0);
    const averageRating = propertiesData.length > 0 
      ? propertiesData.reduce((sum, p) => sum + p.rating, 0) / propertiesData.length 
      : 0;

    setStats({
      totalProperties,
      totalBookings,
      pendingBookings,
      totalRevenue,
      averageRating
    });
  };

  const handleBookingAction = async (bookingId: string, action: 'confirm' | 'reject') => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'confirm' ? 'confirmed' : 'cancelled' 
        }),
      });

      if (response.ok) {
        toast({
          title: action === 'confirm' ? 'Réservation confirmée' : 'Réservation rejetée',
          description: `La réservation a été ${action === 'confirm' ? 'confirmée' : 'rejetée'} avec succès.`,
        });
        fetchDashboardData(); // Recharger les données
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de traiter la réservation',
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
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord propriétaire</h1>
              <p className="text-gray-600 mt-2">
                Gérez vos propriétés et réservations
              </p>
            </div>
            <Button onClick={() => router.push('/owner/properties/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une propriété
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Propriétés</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Réservations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Euro className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue}€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mes propriétés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Mes propriétés
              </CardTitle>
              <CardDescription>
                Gérez vos propriétés de location
              </CardDescription>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune propriété
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par ajouter votre première propriété.
                  </p>
                  <Button onClick={() => router.push('/owner/properties/new')}>
                    Ajouter une propriété
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.slice(0, 3).map((property) => (
                    <div key={property._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      {property.images.length > 0 && (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{property.title}</h4>
                        <p className="text-sm text-gray-600">
                          {property.location.city}, {property.location.country}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {property.price.perNight}€/nuit
                          </span>
                          <span className="text-sm text-gray-500">
                            {property.capacity.guests} voyageurs
                          </span>
                          <Badge variant={property.isAvailable ? 'default' : 'secondary'}>
                            {property.isAvailable ? 'Disponible' : 'Indisponible'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {properties.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/owner/properties')}
                    >
                      Voir toutes les propriétés ({properties.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Réservations récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Réservations récentes
              </CardTitle>
              <CardDescription>
                Gérez les demandes de réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune réservation
                  </h3>
                  <p className="text-gray-600">
                    Vous n'avez pas encore de réservations.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {booking.propertyId.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {booking.userId.firstName} {booking.userId.lastName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Arrivée:</span> {formatDate(booking.startDate)}
                        </div>
                        <div>
                          <span className="font-medium">Départ:</span> {formatDate(booking.endDate)}
                        </div>
                        <div>
                          <span className="font-medium">Voyageurs:</span> {booking.guests}
                        </div>
                        <div>
                          <span className="font-medium">Prix:</span> {booking.totalPrice}€
                        </div>
                      </div>

                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleBookingAction(booking._id, 'confirm')}
                          >
                            Confirmer
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleBookingAction(booking._id, 'reject')}
                          >
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {bookings.length > 5 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/owner/bookings')}
                    >
                      Voir toutes les réservations ({bookings.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}