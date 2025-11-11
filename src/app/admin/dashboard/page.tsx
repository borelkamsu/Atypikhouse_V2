'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Building, 
  Calendar, 
  Euro, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Home,
  UserCheck,
  UserX
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalOwners: number;
  pendingOwners: number;
  totalProperties: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  averageRating: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOwners: 0,
    pendingOwners: 0,
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
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Récupérer les statistiques des propriétaires
      const ownersResponse = await fetch('/api/admin/owners');
      if (ownersResponse.ok) {
        const owners = await ownersResponse.json();
        const totalOwners = owners.length;
        const pendingOwners = owners.filter((o: any) => o.hostStatus === 'pending').length;
        
        setStats(prev => ({
          ...prev,
          totalOwners,
          pendingOwners
        }));
      }

      // Récupérer les statistiques des propriétés
      const propertiesResponse = await fetch('/api/properties');
      if (propertiesResponse.ok) {
        const properties = await propertiesResponse.json();
        setStats(prev => ({
          ...prev,
          totalProperties: properties.length,
          averageRating: properties.length > 0 
            ? properties.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / properties.length 
            : 0
        }));
      }

      // Récupérer les statistiques des réservations
      const bookingsResponse = await fetch('/api/bookings?role=admin');
      if (bookingsResponse.ok) {
        const bookings = await bookingsResponse.json();
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;
        const totalRevenue = bookings
          .filter((b: any) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum: number, b: any) => sum + b.totalPrice, 0);
        
        setStats(prev => ({
          ...prev,
          totalBookings,
          pendingBookings,
          totalRevenue
        }));
      }

      // Récupérer les statistiques des utilisateurs
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        setStats(prev => ({
          ...prev,
          totalUsers: users.length
        }));
      }

    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des statistiques',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
              <p className="text-gray-600 mt-2">
                Vue d'ensemble de la plateforme AtypikHouse
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-600">Administrateur</span>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Propriétaires</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOwners}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-purple-600" />
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
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Réservations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Actions en attente
              </CardTitle>
              <CardDescription>
                Éléments nécessitant votre attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Propriétaires en attente</p>
                    <p className="text-sm text-gray-600">Demandes d'approbation</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-600">{stats.pendingOwners}</span>
                  <Button 
                    size="sm" 
                    onClick={() => router.push('/admin/owners')}
                  >
                    Voir
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Réservations en attente</p>
                    <p className="text-sm text-gray-600">Nouvelles demandes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">{stats.pendingBookings}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push('/admin/bookings')}
                  >
                    Voir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Performance
              </CardTitle>
              <CardDescription>
                Indicateurs de performance de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Euro className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Revenus totaux</p>
                    <p className="text-sm text-gray-600">Toutes les réservations</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.totalRevenue}€</span>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Note moyenne</p>
                    <p className="text-sm text-gray-600">Toutes les propriétés</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {stats.averageRating.toFixed(1)}/5
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liens rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion rapide</CardTitle>
            <CardDescription>
              Accès direct aux principales fonctionnalités d'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/admin/owners')}
              >
                <Building className="h-6 w-6" />
                <span>Gérer les propriétaires</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/admin/users')}
              >
                <Users className="h-6 w-6" />
                <span>Gérer les utilisateurs</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/admin/properties')}
              >
                <Home className="h-6 w-6" />
                <span>Gérer les propriétés</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/admin/bookings')}
              >
                <Calendar className="h-6 w-6" />
                <span>Gérer les réservations</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
