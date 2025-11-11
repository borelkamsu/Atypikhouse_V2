'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, Euro, MapPin, Star } from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  price: {
    perNight: number;
    currency: string;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
  };
  images: string[];
  rating: number;
}

export default function BookPropertyPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  useEffect(() => {
    if (startDate && endDate && property) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setTotalDays(days);
      setTotalPrice(days * property.price.perNight);
    }
  }, [startDate, endDate, property]);

    const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        toast({
          title: 'Erreur',
          description: 'Propriété non trouvée',
          variant: 'destructive',
        });
        router.push('/properties');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement de la propriété',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: params.id,
          startDate,
          endDate,
          guests,
          specialRequests,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Réservation créée !',
          description: 'Votre réservation a été envoyée avec succès.',
        });
        router.push('/bookings');
      } else {
        toast({
          title: 'Erreur de réservation',
          description: result.message || 'Une erreur est survenue',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la réservation',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Propriété non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations de la propriété */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{property.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {property.location.address}, {property.location.city}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">{property.rating}/5</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{property.capacity.guests} voyageurs</span>
                    </div>
                    <div>
                      <span>{property.capacity.bedrooms} chambre{property.capacity.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                    <div>
                      <span>{property.capacity.bathrooms} salle{property.capacity.bathrooms > 1 ? 's' : ''} de bain</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-700">{property.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {property.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Formulaire de réservation */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5" />
                  {property.price.perNight}€ / nuit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Arrivée</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Départ</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Nombre de voyageurs</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max={property.capacity.guests}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Demandes spéciales (optionnel)</Label>
                    <textarea
                      id="specialRequests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Avez-vous des demandes particulières ?"
                    />
                  </div>

                  {totalDays > 0 && (
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>{property.price.perNight}€ × {totalDays} nuit{totalDays > 1 ? 's' : ''}</span>
                        <span>{totalPrice}€</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{totalPrice}€</span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isBooking || !startDate || !endDate}
                  >
                    {isBooking ? 'Réservation en cours...' : 'Réserver maintenant'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
