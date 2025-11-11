import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Building,
  Pencil
} from 'lucide-react';
import { verifyToken } from '@/lib/auth/jwt';
import { getOwnerProperties, getOwnerBookings, calculateOwnerStats } from '@/lib/server/owner-data';
import { DeletePropertyForm } from '@/components/owner/delete-property-form';
import { BookingActions } from '@/components/owner/booking-actions';

export default async function OwnerDashboard() {
  // Vérifier l'authentification
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    redirect('/login');
  }

  if (!decoded) {
    redirect('/login');
  }

  // Charger les données côté serveur
  const properties = await getOwnerProperties(decoded.userId);
  const bookings = await getOwnerBookings(decoded.userId);
  const stats = await calculateOwnerStats(properties, bookings);

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
            <Link href="/owner/properties/new">
              <Button data-testid="button-add-property">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une propriété
              </Button>
            </Link>
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
                  <Link href="/owner/properties/new">
                    <Button data-testid="button-add-first-property">
                      Ajouter une propriété
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.slice(0, 3).map((property) => (
                    <div key={property._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      {property.images.length > 0 && (
                        <img
                          src={property.images[0].url}
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
                      <div className="flex gap-2">
                        <Link href={`/owner/properties/${property._id}/edit`}>
                          <Button
                            size="sm"
                            variant="outline"
                            data-testid={`button-edit-${property._id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeletePropertyForm
                          propertyId={property._id}
                          propertyTitle={property.title}
                        />
                      </div>
                    </div>
                  ))}
                  {properties.length > 3 && (
                    <Link href="/owner/properties">
                      <Button
                        variant="outline"
                        className="w-full"
                        data-testid="button-view-all-properties"
                      >
                        Voir toutes les propriétés ({properties.length})
                      </Button>
                    </Link>
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
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(booking.status)}
                            <h4 className="font-medium text-gray-900">
                              {booking.propertyId.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {booking.userId.firstName} {booking.userId.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Du {formatDate(booking.startDate)} au {formatDate(booking.endDate)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.guests} voyageurs • {booking.totalPrice}€
                          </p>
                        </div>
                        <div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                      {booking.status === 'pending' && (
                        <BookingActions bookingId={booking._id} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
